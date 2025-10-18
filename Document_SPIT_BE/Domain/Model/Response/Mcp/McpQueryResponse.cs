using System;
using System.Collections.Generic;

namespace Domain.Model.Response.Mcp
{
    /// <summary>
    /// Response cho query MCP
    /// </summary>
    public class McpQueryResponse
    {
        /// <summary>
        /// Session ID
        /// </summary>
        public string SessionId { get; set; } = string.Empty;

        /// <summary>
        /// Intent được phân tích
        /// </summary>
        public string Intent { get; set; } = string.Empty;

        /// <summary>
        /// Response được generate
        /// </summary>
        public string Response { get; set; } = string.Empty;

        /// <summary>
        /// Danh sách tài liệu tìm được (nếu có)
        /// </summary>
        public List<DocumentSearchResult>? Documents { get; set; }

        /// <summary>
        /// Trạng thái thành công
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        /// Thông báo lỗi (nếu có)
        /// </summary>
        public string? Error { get; set; }
    }

    /// <summary>
    /// Kết quả tìm kiếm tài liệu
    /// </summary>
    public class DocumentSearchResult
    {
        /// <summary>
        /// ID tài liệu
        /// </summary>
        public long DocumentId { get; set; }

        /// <summary>
        /// Tiêu đề
        /// </summary>
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// Mô tả
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Điểm liên quan
        /// </summary>
        public double RelevanceScore { get; set; }
    }
}
