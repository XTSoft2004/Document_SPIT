using System;
using System.Collections.Generic;

namespace Domain.Model.Mcp
{
    /// <summary>
    /// Request model cho MCP tool calls
    /// </summary>
    public class McpToolRequest
    {
        /// <summary>
        /// Tên của tool cần gọi (vd: search_document)
        /// </summary>
        public string ToolName { get; set; }

        /// <summary>
        /// Tham số cho tool
        /// </summary>
        public Dictionary<string, object> Parameters { get; set; }

        /// <summary>
        /// Session ID để tracking progress (optional)
        /// </summary>
        public string? SessionId { get; set; }

        /// <summary>
        /// User query gốc
        /// </summary>
        public string? Query { get; set; }
    }

    /// <summary>
    /// Request cho search document tool
    /// </summary>
    public class SearchDocumentRequest
    {
        /// <summary>
        /// Query tìm kiếm
        /// </summary>
        public string Query { get; set; }

        /// <summary>
        /// Số trang (mặc định 1)
        /// </summary>
        public int PageNumber { get; set; } = 1;

        /// <summary>
        /// Số lượng items mỗi trang (mặc định 10)
        /// </summary>
        public int PageSize { get; set; } = 10;

        /// <summary>
        /// Lọc theo trạng thái (optional)
        /// </summary>
        public string? StatusDocument { get; set; }

        /// <summary>
        /// Session ID để tracking progress
        /// </summary>
        public string? SessionId { get; set; }
    }
}
