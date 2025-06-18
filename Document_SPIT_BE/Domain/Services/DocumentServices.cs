using Domain.Base.Services;
using Domain.Common;
using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Document;
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
            
            if (await _googleDriverServices.GetInfoFolder(documentRequest.FolderId) != null)
                return HttpResponse.Error("Thư mục không tồn tại hoặc không hợp lệ.", System.Net.HttpStatusCode.BadRequest);

            var documentCreate = new Document()
            {
                Name = documentRequest.Name?.Trim(),
                TotalDownloads = documentRequest.TotalDownloads ?? 0,
                TotalViews = documentRequest.TotalViews ?? 0,
                FileId = documentRequest.FileId?.Trim(),
                IsPrivate = documentRequest.IsPrivate ?? false,
                StatusDocument = StatusDocument_Enum.Pending,
                UserId = documentRequest.UserId ?? 0,
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

            if (await _googleDriverServices.GetInfoFolder(documentRequest.FolderId) != null)
                return HttpResponse.Error("Thư mục không tồn tại hoặc không hợp lệ.", System.Net.HttpStatusCode.BadRequest);

            document.Name = documentRequest.Name?.Trim() ?? document.Name;
            document.TotalDownloads = documentRequest.TotalDownloads ?? document.TotalDownloads;
            document.TotalViews = documentRequest.TotalViews ?? document.TotalViews;
            document.FileId = documentRequest.FileId?.Trim() ?? document.FileId;
            document.IsPrivate = documentRequest.IsPrivate ?? document.IsPrivate;
            document.StatusDocument = EnumExtensions.GetEnumFromDisplayName<StatusDocument_Enum>(documentRequest.StatusDocument);
            document.UserId = documentRequest.UserId ?? document.UserId;
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
    }
}
