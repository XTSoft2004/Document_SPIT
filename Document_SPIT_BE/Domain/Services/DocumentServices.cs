using Domain.Base.Services;
using Domain.Common;
using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.GoogleDriver.Model.Request;
using Domain.Common.GoogleDriver.Model.Response;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Document;
using Domain.Model.Response.Document;
using Domain.Model.Response.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class DocumentServices : BaseService, IDocumentServices
    {
        private readonly IRepositoryBase<Document>? _document;
        private readonly IRepositoryBase<Course>? _course;
        private readonly IRepositoryBase<DetailDocument>? _detailDocument;
        private readonly IRepositoryBase<User>? _user;
        private readonly IRepositoryBase<History> _history;
        private readonly IGoogleDriverServices? _googleDriverServices;
        private readonly ITokenServices? _tokenServices;
        private readonly IRepositoryBase<OneTimeToken>? _oneTimeToken;
        private UserTokenResponse? userMeToken;

        public DocumentServices(IRepositoryBase<Document>? document, IRepositoryBase<User>? user, IGoogleDriverServices? googleDriverServices, IRepositoryBase<DetailDocument>? detailDocument, ITokenServices? tokenServices, IRepositoryBase<OneTimeToken>? oneTimeToken, IRepositoryBase<Course>? course)
        {
            _document = document;
            _user = user;
            _googleDriverServices = googleDriverServices;
            _detailDocument = detailDocument;
            _tokenServices = tokenServices;
            userMeToken = _tokenServices.GetTokenBrowser();
            _oneTimeToken = oneTimeToken;
            _course = course;
            var envPath = Path.Combine(Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).Parent.Parent.Parent.Parent.FullName, ".env");
            DotNetEnv.Env.Load(envPath);
        }

        public async Task<HttpResponse> CreatePending(DocumentPendingRequest documentCreatePending)
        {
            var user = _user!.Find(f => f.Id == userMeToken.Id);
            if (user == null)
                return HttpResponse.Error("Người dùng không tồn tại.", System.Net.HttpStatusCode.BadRequest);

            string base64Check = documentCreatePending.base64String.Split(',').Length == 2 ? documentCreatePending.base64String.Split(',')[1] : string.Empty;
            if (string.IsNullOrEmpty(base64Check))
                return HttpResponse.Error("Base64 không hợp lệ, vui lòng kiểm tra lại.", System.Net.HttpStatusCode.BadRequest);

            // Kiểm tra thông tin tài liệu
            if (AppExtension.IsBase64String(base64Check) == false)
                return HttpResponse.Error("Base64 không hợp lệ, vui lòng kiểm tra lại.", System.Net.HttpStatusCode.BadRequest);

            // Tính toán MD5 từ Base64
            var md5Hash = AppExtension.GetMd5FromBase64(base64Check);
            if (_document.Find(f => f.Md5Checksum == md5Hash) != null)
                return HttpResponse.Error("Tài liệu đã tồn tại.", System.Net.HttpStatusCode.Conflict);

            var course = _course!.Find(f => f.Id == documentCreatePending.courseId);
            if (course == null)
                return HttpResponse.Error("Khóa học không tồn tại.", System.Net.HttpStatusCode.BadRequest);


            string nameFile = $"{Guid.NewGuid():N}{System.IO.Path.GetExtension(documentCreatePending.fileName ?? string.Empty)}";
            // Tải lên tài liệu lên Google Drive
            string FOLDER_PENDING = Environment.GetEnvironmentVariable("FOLDER_PENDING");
            UploadFileResponse FileId = await _googleDriverServices.UploadFile(new UploadFileBase64Request
            {
                Base64String = base64Check,
                FileName = nameFile,
                FolderId = FOLDER_PENDING
            });
            if (FileId == null || string.IsNullOrEmpty(FileId.id))
                return HttpResponse.Error("Tải lên tài liệu thất bại.", System.Net.HttpStatusCode.InternalServerError);

            // Tạo mới tài liệu
            var documentCreate = new Document
            {
                Name = documentCreatePending.name?.Trim(),
                FileId = FileId.id,
                FileName = nameFile ?? "Không rõ",
                Md5Checksum = md5Hash,
                IsPrivate = false,
                StatusDocument = StatusDocument_Enum.Pending,

                // Thêm thông tin người dùng
                UserId = userMeToken.Id ?? 0,
                User = user,

                Course = course,
                CourseId = course.Id,

                FolderId = FOLDER_PENDING,
                CreatedDate = DateTime.Now,
                ModifiedDate = DateTime.Now
            };
            _document.Insert(documentCreate);
            await UnitOfWork.CommitAsync();
            var listDocument = _document.All().ToList();

            return HttpResponse.OK(message: "Tạo tài liệu thành công, đang chờ xét duyệt.");
        }
        public async Task<HttpResponse> ReviewAsync(long? Id, DocumentReviewRequest documentRequest)
        {
            var user = _user!.Find(f => f.Id == userMeToken.Id);
            if (user == null)
                return HttpResponse.Error("Người dùng không tồn tại.", System.Net.HttpStatusCode.BadRequest);

            if (await _googleDriverServices.GetInfoFolder(documentRequest.folderId) == null)
                return HttpResponse.Error("Thư mục không tồn tại hoặc không hợp lệ.", System.Net.HttpStatusCode.BadRequest);

            var documentPending = _document!.Find(f => f.Id == Id);
            if (documentPending == null)
                return HttpResponse.Error("Tài liệu không tồn tại.", System.Net.HttpStatusCode.NotFound);

            var course = _course!.Find(f => f.Id == documentRequest.courseId);
            if (course == null)
                return HttpResponse.Error("Khóa học không tồn tại.", System.Net.HttpStatusCode.BadRequest);

            documentPending.Name = documentRequest.name?.Trim() ?? documentPending.Name;
            documentPending.Course = course;
            documentPending.CourseId = course.Id;
            documentPending.StatusDocument = EnumExtensions.GetEnumValueFromDisplayName<StatusDocument_Enum>(documentRequest.statusDocument) ?? documentPending.StatusDocument;
            _document.Update(documentPending);
            await UnitOfWork.CommitAsync(); 

            if(documentPending.StatusDocument == StatusDocument_Enum.Approved)
            {
                await _googleDriverServices.CutFile(documentPending.FileId, documentRequest.folderId?.Trim(), documentPending.FolderId);
                documentPending.FolderId = documentRequest.folderId?.Trim() ?? documentPending.FolderId;
                // Sao chép file từ thư mục Pending sang thư mục đã duyệt
                //await _googleDriverServices.CopyFile(fileId: documentPending.FileId, documentPending.FolderId);
                // Tạo mới chi tiết tài liệu
                var detailDocument = new DetailDocument
                {
                    DocumentId = documentPending.Id,
                    Document = documentPending,
                    CreatedDate = DateTime.Now
                };
                _detailDocument?.Insert(detailDocument);
                await UnitOfWork.CommitAsync();

                // Cập nhật tài liệu với chi tiết tài liệu
                documentPending.DetaiDocument = detailDocument;
                documentPending.DetaiDocumentId = detailDocument.Id;
                _detailDocument.Update(detailDocument);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Duyệt tài liệu thành công.");
            }

            return HttpResponse.OK(message: "Đánh giá tài liệu đã xong.");
        }
        // Cập nhật tài liệu theo IdDocument
        public async Task<HttpResponse> UpdateAsync(long IdDocument, DocumentRequest documentRequest)
        {
            var document = _document!.Find(f => f.Id == IdDocument);
            if (document == null)
                return HttpResponse.Error("Tài liệu không tồn tại.", System.Net.HttpStatusCode.NotFound);

            StatusDocument_Enum? enumStatusDocument = null;
            if (documentRequest.StatusDocument != null)
            {
                enumStatusDocument = EnumExtensions.GetEnumValueFromDisplayName<StatusDocument_Enum>(documentRequest.StatusDocument);
                if (enumStatusDocument == null)
                    return HttpResponse.Error("Trạng thái điểm danh không hợp lệ.", System.Net.HttpStatusCode.BadRequest);
            }

            var user = _user!.Find(f => f.Id == userMeToken.Id);
            if (user == null)
                return HttpResponse.Error("Người dùng không tồn tại.", System.Net.HttpStatusCode.NotFound);

            // Thay đổi môn học tài liệu
            if(documentRequest.courseId != null)
            {
                var course = _course!.Find(f => f.Id == documentRequest.courseId);
                if (course == null)
                    return HttpResponse.Error("Khóa học không tồn tại.", System.Net.HttpStatusCode.NotFound);

                if (course.Id != document.CourseId)
                {
                    // Nếu khóa học khác thì cập nhật lại khóa học
                    document.Course = course;
                    document.CourseId = course.Id;
                }
            }

            // Khi thêm file mới thì upload lại file mới
            if (!string.IsNullOrEmpty(documentRequest.FolderId?.Trim()) &&
                !string.IsNullOrEmpty(documentRequest.Base64String) &&
                !string.IsNullOrEmpty(documentRequest.FileName))
            {
                await _googleDriverServices.DeleteFile(document.FileId);

                if (await _googleDriverServices.GetInfoFolder(documentRequest.FolderId) == null)
                    return HttpResponse.Error("Thư mục không tồn tại hoặc không hợp lệ.", System.Net.HttpStatusCode.BadRequest);

                // Kiểm tra thông tin tài liệu
                if (AppExtension.IsBase64String(documentRequest.Base64String) == false)
                    return HttpResponse.Error("Base64 không hợp lệ, vui lòn kiểm tra lại.", System.Net.HttpStatusCode.BadRequest);

                // Tính toán MD5 từ Base64
                var md5Hash = AppExtension.GetMd5FromBase64(documentRequest.Base64String);
                if (_document.Find(f => f.Md5Checksum == md5Hash) != null)
                    return HttpResponse.Error("Tài liệu đã tồn tại.", System.Net.HttpStatusCode.Conflict);
                else
                {
                    // Nếu tài liệu đã có FileId thì không cần tải lên lại, chỉ cập nhật MD5 và thông tin khác
                    UploadFileResponse FileId = await _googleDriverServices.UploadFile(new UploadFileBase64Request
                    {
                        Base64String = documentRequest.Base64String,
                        FileName = documentRequest.Name?.Trim() ?? "Không rõ",
                        FolderId = documentRequest.FolderId?.Trim()
                    });
                    if (FileId == null || string.IsNullOrEmpty(FileId.id))
                        return HttpResponse.Error("Tải lên tài liệu thất bại.", System.Net.HttpStatusCode.InternalServerError);
                    else
                    {
                        document.FileId = FileId.id ?? document.FileId;
                        document.FileName = documentRequest.FileName?.Trim() ?? document.FileName;
                        document.Md5Checksum = md5Hash ?? document.Md5Checksum;
                    }
                }
                document.FolderId = documentRequest.FolderId?.Trim() ?? document.FolderId;
            }

            // Khi thấy thư mục khác thì cắt file sang thư mục mới
            if (documentRequest.FolderId != null && documentRequest.FolderId != document.FolderId)
            {
                // Kiểm tra xem thư mục có tồn tại không
                if (await _googleDriverServices.GetInfoFolder(documentRequest.FolderId) == null)
                    return HttpResponse.Error("Thư mục không tồn tại hoặc không hợp lệ.", System.Net.HttpStatusCode.BadRequest);
                // Cắt file từ thư mục cũ sang thư mục mới
                await _googleDriverServices.CutFile(document.FileId, documentRequest.FolderId, document.FolderId);
                document.FolderId = documentRequest.FolderId;
            }


            document.Name = documentRequest.Name?.Trim() ?? document.Name;
            document.IsPrivate = documentRequest.IsPrivate ?? document.IsPrivate;
            document.StatusDocument = enumStatusDocument ?? document.StatusDocument;

            // Cập nhật thông tin người dùng
            document.UserId = userMeToken.Id ?? document.UserId;
            document.User = user;

            document.ModifiedDate = DateTime.Now;
            document.ModifiedBy = userMeToken.Username ?? document.ModifiedBy;

            _document.Update(document);
            await UnitOfWork.CommitAsync();

            return HttpResponse.OK(message: "Cập nhật tài liệu thành công.");
        }
        // Xoá tài liệu theo IdDocument
        public async Task<HttpResponse> DeleteAsync(long IdDocument)
        {
            var document = _document!.Find(f => f.Id == IdDocument);
            if (document == null)
                return HttpResponse.Error("Tài liệu không tồn tại.", System.Net.HttpStatusCode.NotFound);

            _document.Delete(document);
            await UnitOfWork.CommitAsync();

            // Cập nhật lịch sử của tài liệu
            var history = new UserHistoryResponse
            {
                Title = "Xoá tài liệu",
                function_status = Function_Enum.Delete_Document,
                UserId = document.UserId,
                Fullname = _user.Find(f => f.Id == document.UserId)?.Fullname,
            };

            return HttpResponse.OK(message: "Xoá tài liệu thành công.");
        }
        public async Task ViewFile(string FileId)
        {
            var document = _document!.Find(f => f.FileId == FileId);
            if (document == null)
                return;

            var itemReacted = _detailDocument.Find(f => f.Id == document.Id);
            if (itemReacted == null)
                return;

            itemReacted.TotalView += 1;
            _detailDocument.Update(itemReacted);
            await UnitOfWork.CommitAsync();
        }
        public async Task<(byte[] Data, string ContentType, string FileName)> DownloadFile(string FileId)
        {
            var document = _document!.Find(f => f.FileId == FileId);
            if (document == null)
                return (null, null, null);

            var itemReacted = _detailDocument.Find(f => f.Id == document.Id);
            if (itemReacted == null)
                return (null, null, null);

            itemReacted.TotalDownload += 1;
            _detailDocument.Update(itemReacted);
            await UnitOfWork.CommitAsync();

            var result = await _googleDriverServices.GetGoogleDrivePreviewAsync(document.FileId);
            if (result == null)
                return (null, null, null);

            var (data, contentType, fileName) = result.Value;
            return (data, contentType, fileName);
        }
        public List<DocumentResponse> GetDocuments(string search, int pageNumber, int pageSize, out int totalRecords, string statusDocument = "")
        {
            // Start with queryable including navigation properties
            var query = _document!.All()
                .Include(d => d.User)
                .Include(d => d.Course)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                string searchLower = search.ToLower();

                #region Tìm kiếm trạng thái tài liệu
                var enumStatusExist = EnumExtensions.GetAllDisplayNames<StatusDocument_Enum>()
                    .FirstOrDefault(w => w != null && w.ToLower().Contains(searchLower));
                StatusDocument_Enum? enumStatus = null;
                if (!string.IsNullOrEmpty(enumStatusExist))
                {
                    enumStatus = EnumExtensions.GetEnumFromDisplayName<StatusDocument_Enum>(enumStatusExist);
                }
                #endregion

                query = query.Where(d =>
                    (d.Name != null && d.Name.ToLower().Contains(searchLower)) ||
                    (d.User != null && d.User.Fullname != null && d.User.Fullname.ToLower().Contains(searchLower)) ||
                    (d.StatusDocument != null && d.StatusDocument.ToString() != null && d.StatusDocument.ToString()!.ToLower().Contains(searchLower)) ||
                    (d.StatusDocument != null && enumStatus != null && d.StatusDocument == enumStatus)
                );
            }

            if (!string.IsNullOrEmpty(statusDocument))
                query = query.Where(d =>
                    d.StatusDocument != null &&
                    d.StatusDocument.ToString() != null &&
                    d.StatusDocument.ToString()!.ToLower() == statusDocument.ToLower()
                );

            // Đếm số bản ghi trước khi phân trang
            totalRecords = query.Count();

            // Sắp xếp theo ModifiedDate
            var orderedQuery = query.OrderByDescending(d => d.ModifiedDate);

            if (pageNumber != -1 && pageSize != -1)
            {
                orderedQuery = (IOrderedQueryable<Document>)orderedQuery.Skip((pageNumber - 1) * pageSize).Take(pageSize);
            }

            var users = _user!.All().ToList();

            // Chuyển đổi sang danh sách DocumentResponse
            var documentsSearch = orderedQuery
                .AsEnumerable()
                .Select(s => new DocumentResponse()
                {
                    Id = s.Id,
                    Name = s.Name,
                    TotalDownloads = s.DetaiDocument != null ? s.DetaiDocument.TotalDownload : 0,
                    TotalViews = s.DetaiDocument != null ? s.DetaiDocument.TotalView : 0,
                    FileId = s.FileId,
                    FileName = s.FileName,
                    IsPrivate = s.IsPrivate,
                    StatusDocument = s.StatusDocument?.ToString(),
                    FullNameUser = s.User != null ? s.User.Fullname : string.Empty,
                    FolderId = s.FolderId,
                    CourseId = s.CourseId,
                    CourseName = s.Course != null ? s.Course.Name : string.Empty,
                    CreatedDate = s.CreatedDate,
                    ModifiedDate = s.ModifiedDate
                }).ToList();

            return documentsSearch;
        }
        public async Task<HttpResponse> GetLinkView(long? DocumentId)
        {
            var document = _document!.Find(f => f.Id == DocumentId);
            if(document == null)
                return HttpResponse.Error("Tài liệu không tồn tại.", System.Net.HttpStatusCode.NotFound);

            var documentDriver = await _googleDriverServices.GetInfoById(document.FileId);
            if(documentDriver == null)
                return HttpResponse.Error("Thư mục tài liệu không tồn tại hoặc không hợp lệ.", System.Net.HttpStatusCode.NotFound); 

            var user = _user.Find(f => f.Id == userMeToken.Id);

            var guid= Guid.NewGuid().ToString("N");
            _oneTimeToken.Insert(new OneTimeToken
            {
                Code = guid,
                FileId = document.FileId,
                User = user,
                UserId = user.Id,
                CreatedDate = DateTime.Now
            });
            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: "Lấy link thành công.", data: new { Code = $"{guid}" });
        }
        public async Task<(byte[] Data, string ContentType, string FileName)?> ViewOnce(string code)
        {
            var oneTimeToken = _oneTimeToken!.Find(f => f.Code == code);
            if (oneTimeToken == null)
                return null;
            // Kiểm tra xem token đã hết hạn hay chưa
            if (oneTimeToken.CreatedDate.AddSeconds(30) < DateTime.Now)
            {
                _oneTimeToken.Delete(oneTimeToken);
                await UnitOfWork.CommitAsync();
                return null;
            }
            // Lấy thông tin tài liệu từ FileId
            var document = _document.Find(f => f.FileId == oneTimeToken.FileId);
            if (document == null)
                return null;
            // Xoá token sau khi sử dụng
            //_oneTimeToken.Delete(oneTimeToken);
            //await UnitOfWork.CommitAsync();
            // Tăng số lần xem tài liệu
            await ViewFile(document.FileId);
            return await _googleDriverServices.GetGoogleDrivePreviewAsync(document.FileId);
        }
        public async Task<(byte[] Data, string ContentType, string FileName)?> GetPreviewByDocumetId(long DocumentId)
        {
            var document = _document!.Find(f => f.Id == DocumentId);
            if (document == null)
                return (null, null, null);

            await ViewFile(document.FileId);
            return await _googleDriverServices.GetGoogleDrivePreviewAsync(document.FileId);
        }
        public async Task<HttpResponse> GetRecentDocuments(int number)
        {
            var documents = _document!.All()
                .Where(d => d.IsPrivate == false)
                .OrderByDescending(d => d.ModifiedDate)
                .Take(number)
                .ToList();

            var responseList = documents.Select(s => new DocumentRecentResponse
            {
                Id = s.Id,
                Name = s.Name,
                FileId = s.FileId,
                FileName = s.FileName,
                TotalDownloads = s.DetaiDocument?.TotalDownload ?? 0,
                TotalViews = s.DetaiDocument?.TotalView ?? 0,
                CreatedDate = s.CreatedDate,
                ModifiedDate = s.ModifiedDate
            }).ToList();

            foreach (var doc in responseList)
            {
                var userId = documents.First(d => d.Id == doc.Id).UserId;
                var user = _user.Find(f => f.Id == userId);
                doc.Fullname = user?.Fullname ?? "Không rõ";
            }

            return HttpResponse.OK(data: responseList, message: "Lấy danh sách tài liệu gần đây thành công.");
        }
    }
}
