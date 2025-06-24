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
        private readonly IRepositoryBase<DetailDocument>? _detailDocument;
        private readonly IRepositoryBase<User>? _user;
        private readonly IRepositoryBase<History> _history;
        private readonly IGoogleDriverServices? _googleDriverServices;
        private readonly ITokenServices? _tokenServices;
        private UserTokenResponse? userMeToken;

        public DocumentServices(IRepositoryBase<Document>? document, IRepositoryBase<User>? user, IGoogleDriverServices? googleDriverServices, IRepositoryBase<DetailDocument>? detailDocument, ITokenServices? tokenServices)
        {
            _document = document;
            _user = user;
            _googleDriverServices = googleDriverServices;
            _detailDocument = detailDocument;
            _tokenServices = tokenServices;
            userMeToken = _tokenServices.GetTokenBrowser();
        }
        // Tạo mơi tài liệu
        public async Task<HttpResponse> CreateAsync(DocumentCreateRequest documentRequest)
        {
            //// Kiểm tra loại tài liệu đã tồn tại hay chưa
            //if (!EnumExtensions.IsValidDisplayName(documentRequest.StatusDocument, typeof(StatusDocument_Enum)))
            //    return HttpResponse.Error("Trạng thái điểm danh không hợp lệ.", System.Net.HttpStatusCode.BadRequest);

            // Kiểm tra người dùng có tồn tại hay không
            var user = _user!.Find(f => f.Id == userMeToken.Id);
            if (user == null)
                return HttpResponse.Error("Người dùng không tồn tại.", System.Net.HttpStatusCode.BadRequest);

            if (await _googleDriverServices.GetInfoFolder(documentRequest.folderId) == null)
                return HttpResponse.Error("Thư mục không tồn tại hoặc không hợp lệ.", System.Net.HttpStatusCode.BadRequest);

            string base64Check = documentRequest.base64String.Split(',').Length == 2 ? documentRequest.base64String.Split(',')[1] : string.Empty;
            if (string.IsNullOrEmpty(base64Check))
                return HttpResponse.Error("Base64 không hợp lệ, vui lòng kiểm tra lại.", System.Net.HttpStatusCode.BadRequest);
     
            // Kiểm tra thông tin tài liệu
            if (AppExtension.IsBase64String(base64Check) == false)
                return HttpResponse.Error("Base64 không hợp lệ, vui lòng kiểm tra lại.", System.Net.HttpStatusCode.BadRequest);

            // Tính toán MD5 từ Base64
            var md5Hash = AppExtension.GetMd5FromBase64(base64Check);
            if (_document.Find(f => f.Md5Checksum == md5Hash) != null)
                return HttpResponse.Error("Tài liệu đã tồn tại.", System.Net.HttpStatusCode.Conflict);

            // Tải lên tài liệu lên Google Drive
            UploadFileResponse FileId = await _googleDriverServices.UploadFile(new UploadFileBase64Request
            {
                Base64String = base64Check,
                FileName = documentRequest.fileName?.Trim() ?? "Không rõ",
                FolderId = documentRequest.folderId?.Trim()
            });
            if (FileId == null || string.IsNullOrEmpty(FileId.id))
                return HttpResponse.Error("Tải lên tài liệu thất bại.", System.Net.HttpStatusCode.InternalServerError);


            // Tạo mới tài liệu
            var documentCreate = new Document
            {
                Name = documentRequest.name?.Trim(),
                FileId = FileId.id,
                FileName = documentRequest.fileName?.Trim() ?? "Không rõ",
                Md5Checksum = md5Hash,
                IsPrivate = false,
                StatusDocument = StatusDocument_Enum.Pending,

                // Thêm thông tin người dùng
                UserId = userMeToken.Id ?? 0,
                User = user,

                FolderId = documentRequest.folderId?.Trim(),
                CreatedDate = DateTime.Now,
                ModifiedDate = DateTime.Now
            };
            _document.Insert(documentCreate);
            await UnitOfWork.CommitAsync();

            // Tạo mới chi tiết tài liệu
            var detailDocument = new DetailDocument
            {
                DocumentId = documentCreate.Id,
                Document = documentCreate,
                CreatedDate = DateTime.Now
            };
            _detailDocument?.Insert(detailDocument);
            await UnitOfWork.CommitAsync();

            // Cập nhật tài liệu với chi tiết tài liệu
            documentCreate.DetaiDocument = detailDocument;
            documentCreate.DetaiDocumentId = detailDocument.Id;
            _detailDocument.Update(detailDocument);
            await UnitOfWork.CommitAsync();

            // Cập nhật lịch sử của User
            var history = new UserHistoryResponse
            {
                Title = "Tạo tài liệu mới",
                function_status = Function_Enum.Create_Document,
                UserId = documentCreate.UserId,
                Fullname = _user.Find(f => f.Id == documentCreate.UserId)?.Fullname,
            };

            return HttpResponse.OK(message: "Tạo tài liệu thành công.");
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
                return HttpResponse.Error("Người dùng không tồn tại.", System.Net.HttpStatusCode.BadRequest);

            if(!string.IsNullOrEmpty(documentRequest.FolderId?.Trim()) &&
                !string.IsNullOrEmpty(documentRequest.Base64String) &&
                !string.IsNullOrEmpty(documentRequest.FileName))
            {
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

            // Cập nhật lịch sử của User
            var history = new UserHistoryResponse
            {
                Title = "Cập nhật tài liệu",
                function_status = Function_Enum.Update_Document,
                UserId = document.UserId,
                Fullname = _user.Find(f => f.Id == document.UserId)?.Fullname,
            };

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
            if(itemReacted == null)
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
                return (null,null,null);

            var (data, contentType, fileName) = result.Value;
            return (data, contentType, fileName);
        }
        public List<DocumentResponse> GetDocuments(string search, int pageNumber, int pageSize, out int totalRecords)
        {
            var query = _document!.All();
            if (!string.IsNullOrEmpty(search))
            {
                string searchLower = search.ToLower();

                #region Tìm kiếm trạng thái tài liệu
                var enumStatusExist = EnumExtensions.GetAllDisplayNames<StatusDocument_Enum>()
                    .Where(w => w.Contains(searchLower))
                    .FirstOrDefault();
                var enumStatus = EnumExtensions.GetEnumFromDisplayName<StatusDocument_Enum>(enumStatusExist);
                #endregion

                query = query.Where(d =>
                    d.Name.ToLower().Contains(searchLower) ||
                    (d.User != null && d.User.Fullname != null && d.User.Fullname.ToLower().Contains(searchLower)) ||
                    (d.StatusDocument != null && d.StatusDocument.ToString().ToLower().Contains(searchLower)) ||
                    (d.StatusDocument != null && d.StatusDocument == enumStatus)
                );
            }
            // Đếm số bản ghi trước khi phân trang
            totalRecords = query.Count();
            // Sắp xếp theo ID
            query = query.OrderByDescending(d => d.ModifiedDate);
            if (pageNumber != -1 && pageSize != -1)
            {
                query = query.Skip((pageNumber - 1) * pageSize).Take(pageSize);
            }

            // Chuyển đổi sang danh sách DocumentResponse
            var documentsSearch = query.Select(s => new DocumentResponse()
            {
                Id = s.Id,
                Name = s.Name,
                FileId = s.FileId,
                FileName = s.FileName,  
                IsPrivate = s.IsPrivate,
                StatusDocument = s.StatusDocument.ToString(),
                UserId = s.UserId,
                FolderId = s.FolderId,
                CreatedDate = s.CreatedDate,
                ModifiedDate = s.ModifiedDate
            }).ToList();

            return documentsSearch;
        }
        public async Task<(byte[] Data, string ContentType, string FileName)?> GetPreviewByDocumetId(long DocumentId)
        {
            var document = _document!.Find(f => f.Id == DocumentId);    
            if (document == null)
                return (null, null, null);

            await ViewFile(document.FileId);
            return await _googleDriverServices.GetGoogleDrivePreviewAsync(document.FileId);
        }
    }
}
