using Domain.Common.Http;
using Domain.Model.Request.Document;
using Domain.Model.Response.Document;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IDocumentServices
    {
        /// <summary>
        /// Tạo mới tài liệu
        /// </summary>
        /// <param name="documentRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> CreateAsync(DocumentCreateRequest documentRequest);
        /// <summary>
        /// Cập nhật tài liệu theo IdDocument
        /// </summary>
        /// <param name="IdDocument"></param>
        /// <param name="documentRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> UpdateAsync(long IdDocument, DocumentRequest documentRequest);
        /// <summary>
        /// Xoá tài liệu theo IdDocument
        /// </summary>
        /// <param name="IdDocument"></param>
        /// <returns></returns>
        Task<HttpResponse> DeleteAsync(long IdDocument);
        /// <summary>
        /// Xem tài liệu theo IdDocument
        /// </summary>
        /// <param name="IdDocument"></param>
        /// <returns></returns>
        Task ViewFile(string FileId);
        /// <summary>
        /// Tải xuống tài liệu theo IdDocument
        /// </summary>
        /// <param name="IdDocument"></param>
        /// <returns></returns>
        Task<(byte[] Data, string ContentType, string FileName)> DownloadFile(string FileId);
        /// <summary>
        /// Lấy danh sách tài liệu với phân trang và tìm kiếm
        /// </summary>
        /// <param name="search"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalRecords"></param>
        /// <returns></returns>
        List<DocumentResponse> GetDocuments(string search, int pageNumber, int pageSize, out int totalRecords);
        /// <summary>
        /// Lấy tài liệu theo IdDocument
        /// </summary>
        /// <param name="DocumentId"></param>
        /// <returns></returns>
        Task<(byte[] Data, string ContentType, string FileName)?> GetPreviewByDocumetId(long DocumentId);
    }
}
