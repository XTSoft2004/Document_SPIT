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
        /// Tạo mới tài liệu đưa tài liệu vào trạng thái chờ phê duyệt
        /// </summary>
        /// <param name="documentCreatePending"></param>
        /// <returns></returns>
        Task<HttpResponse> CreatePending(DocumentPendingRequest documentCreatePending);
        /// <summary>
        /// Đánh giá tài liệu đưa tài liệu vào trạng thái đã phê duyệt hoặc từ chối
        /// </summary>
        /// <param name="documentRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> ReviewAsync(long? Id, DocumentReviewRequest documentRequest);
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
        Task<(byte[] Data, string ContentType, string FileName)> DownloadFile(long? IdDocument);
        /// <summary>
        /// Lấy danh sách tài liệu với phân trang và tìm kiếm
        /// </summary>
        /// <param name="search"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalRecords"></param>
        /// <returns></returns>
        List<DocumentResponse> GetDocuments(string search, int pageNumber, int pageSize, out int totalRecords, string statusDocument = "");
        /// <summary>
        /// Lấy liên kết xem tài liệu theo IdDocument
        /// </summary>
        /// <param name="DocumentId"></param>
        /// <returns></returns>
        Task<HttpResponse> GetLinkView(long? DocumentId);
        /// <summary>
        /// Xem tài liệu một lần theo mã
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        Task<(byte[] Data, string ContentType, string FileName)?> ViewOnce(string code);
        /// <summary>
        /// Lấy tài liệu theo IdDocument
        /// </summary>
        /// <param name="DocumentId"></param>
        /// <returns></returns>
        Task<(byte[] Data, string ContentType, string FileName)?> GetPreviewByDocumetId(long DocumentId);
        /// <summary>
        /// Lấy danh sách tài liệu gần đây
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        Task<HttpResponse> GetRecentDocuments(int number);
        /// <summary>
        /// Lấy ảnh thu nhỏ của tài liệu theo IdDocument
        /// </summary>
        /// <param name="IdDocument"></param>
        /// <returns></returns>
        Task<string> GetThumbnailBase64(long IdDocument);
        /// <summary>
        /// Lấy danh sách tài liệu của người dùng theo username
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        Task<HttpResponse> GetDocumentMe(string username);
    }
}
