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
        private readonly IRepositoryBase<User>? _user;
        private readonly IGoogleDriverServices? _googleDriverServices;

        public DocumentServices(IRepositoryBase<Document>? document, IRepositoryBase<User>? user, IGoogleDriverServices? googleDriverServices)
        {
            _document = document;
            _user = user;
            _googleDriverServices = googleDriverServices;
        }
        // Tạo mơi tài liệu
        public async Task<HttpResponse> CreateAsync(DocumentRequest documentRequest)
        {
            // Kiểm tra loại tài liệu đã tồn tại hay chưa
            if (!EnumExtensions.IsValidDisplayName(documentRequest.StatusDocument, typeof(StatusDocument_Enum)))
                return HttpResponse.Error("Trạng thái điểm danh không hợp lệ.", System.Net.HttpStatusCode.BadRequest);

            // Kiểm tra người dùng có tồn tại hay không
            var user = _user!.Find(f => f.UserId == documentRequest.UserId);
            if (user == null)
                return HttpResponse.Error("Người dùng không tồn tại.", System.Net.HttpStatusCode.BadRequest);

            if (await _googleDriverServices.GetInfoFolder(documentRequest.FolderId) == null)
                return HttpResponse.Error("Thư mục không tồn tại hoặc không hợp lệ.", System.Net.HttpStatusCode.BadRequest);

            // Kiểm tra thông tin tài liệu
            if (AppExtension.IsBase64String(documentRequest.Base64String) == false)
                return HttpResponse.Error("Base64 không hợp lệ, vui lòn kiểm tra lại.", System.Net.HttpStatusCode.BadRequest);

            // Tính toán MD5 từ Base64
            var md5Hash = AppExtension.GetMd5FromBase64(documentRequest.Base64String);
            if (_document.Find(f => f.Md5Checksum == md5Hash) != null)
                return HttpResponse.Error("Tài liệu đã tồn tại.", System.Net.HttpStatusCode.Conflict);

            // Tải lên tài liệu lên Google Drive
            UploadFileResponse FileId = await _googleDriverServices.UploadFile(new UploadFileBase64Request
            {
                Base64String = documentRequest.Base64String,
                FileName = documentRequest.Name?.Trim() ?? "Không rõ",
                FolderId = documentRequest.FolderId?.Trim()
            });
            if (FileId == null || string.IsNullOrEmpty(FileId.id))
                return HttpResponse.Error("Tải lên tài liệu thất bại.", System.Net.HttpStatusCode.InternalServerError);

            var documentCreate = new Document()
            {
                Name = documentRequest.Name?.Trim(),
                FileId = FileId.id,
                Md5Checksum = md5Hash,
                IsPrivate = documentRequest.IsPrivate ?? false,
                StatusDocument = StatusDocument_Enum.Pending,

                // Thêm thông tin người dùng
                UserId = documentRequest.UserId ?? 0,
                User = user,

                FolderId = documentRequest.FolderId?.Trim(),
                CreatedDate = DateTime.Now
            };
            _document.Insert(documentCreate);
            await UnitOfWork.CommitAsync();

            return HttpResponse.OK(message: "Tạo tài liệu thành công.");
        }
        // Cập nhật tài liệu theo IdDocument
        public async Task<HttpResponse> UpdateAsync(long IdDocument, DocumentRequest documentRequest)
        {
            var document = _document!.Find(f => f.Id == IdDocument);
            if (document == null)
                return HttpResponse.Error("Tài liệu không tồn tại.", System.Net.HttpStatusCode.NotFound);

            if (!EnumExtensions.IsValidDisplayName(documentRequest.StatusDocument, typeof(StatusDocument_Enum)))
                return HttpResponse.Error("Trạng thái điểm danh không hợp lệ.", System.Net.HttpStatusCode.BadRequest);

            var user = _user!.Find(f => f.UserId == documentRequest.UserId);
            if (user == null)
                return HttpResponse.Error("Người dùng không tồn tại.", System.Net.HttpStatusCode.BadRequest);

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
                    document.Md5Checksum = md5Hash ?? document.Md5Checksum;
                }
            }

            document.Name = documentRequest.Name?.Trim() ?? document.Name;
            document.IsPrivate = documentRequest.IsPrivate ?? document.IsPrivate;
            document.StatusDocument = EnumExtensions.GetEnumFromDisplayName<StatusDocument_Enum>(documentRequest.StatusDocument);

            // Cập nhật thông tin người dùng
            document.UserId = documentRequest.UserId ?? document.UserId;
            document.User = user;

            document.FolderId = documentRequest.FolderId?.Trim() ?? document.FolderId;
            document.ModifiedDate = DateTime.Now;

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

            return HttpResponse.OK(message: "Xoá tài liệu thành công.");
        }
        public async Task ViewFile(string FileId)
        {
            var document = _document!.Find(f => f.FileId == FileId);
            if (document == null)
                return;

            document.TotalViews += 1;
            _document.Update(document);
            await UnitOfWork.CommitAsync();
        }
        public async Task<(byte[] Data, string ContentType, string FileName)> DownloadFile(string FileId)
        {
            var document = _document!.Find(f => f.FileId == FileId);
            if (document == null)
                return (null, null, null);

            document.TotalDownloads += 1;
            _document.Update(document);
            await UnitOfWork.CommitAsync();

            var result = await _googleDriverServices.GetGoogleDrivePreviewAsync(document.FileId);
            if (result == null)
                return (null,null,null);

            var (data, contentType, fileName) = result.Value;
            return (data, contentType, fileName);
        }
    }
}
