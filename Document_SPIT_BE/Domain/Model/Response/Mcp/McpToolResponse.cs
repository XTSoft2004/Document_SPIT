using System;
using System.Collections.Generic;

namespace Domain.Model.Mcp
{
    /// <summary>
    /// Response model cho MCP tool
    /// </summary>
    public class McpToolResponse
    {
        /// <summary>
        /// Tool được thực thi
        /// </summary>
        public string ToolName { get; set; }

        /// <summary>
        /// Kết quả trả về
        /// </summary>
        public object Result { get; set; }

        /// <summary>
        /// Trạng thái thực thi
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        /// Thông báo lỗi (nếu có)
        /// </summary>
        public string? ErrorMessage { get; set; }

        /// <summary>
        /// Metadata bổ sung
        /// </summary>
        public Dictionary<string, object>? Metadata { get; set; }

        /// <summary>
        /// Session ID
        /// </summary>
        public string? SessionId { get; set; }
    }

    /// <summary>
    /// Progress update model
    /// </summary>
    public class McpProgressUpdate
    {
        /// <summary>
        /// Session ID
        /// </summary>
        public string SessionId { get; set; }

        /// <summary>
        /// Bước hiện tại (vd: "validating", "searching", "responding")
        /// </summary>
        public string Step { get; set; }

        /// <summary>
        /// Thông điệp hiển thị
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Phần trăm hoàn thành (0-100)
        /// </summary>
        public int Progress { get; set; }

        /// <summary>
        /// Timestamp
        /// </summary>
        public DateTime Timestamp { get; set; } = DateTime.Now;

        /// <summary>
        /// Dữ liệu bổ sung (optional)
        /// </summary>
        public object? Data { get; set; }
    }
}
