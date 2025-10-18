namespace Domain.Model.Request.Mcp
{
    /// <summary>
    /// Request tạo session MCP
    /// </summary>
    public class CreateSessionRequest
    {
        /// <summary>
        /// Device ID của client
        /// </summary>
        public string DeviceId { get; set; } = string.Empty;
    }

    /// <summary>
    /// Request cho query MCP
    /// </summary>
    public class McpQueryRequest
    {
        /// <summary>
        /// Session ID
        /// </summary>
        public string SessionId { get; set; } = string.Empty;

        /// <summary>
        /// Device ID của client
        /// </summary>
        public string DeviceId { get; set; } = string.Empty;

        /// <summary>
        /// Query của người dùng
        /// </summary>
        public string Query { get; set; } = string.Empty;

        /// <summary>
        /// Context bổ sung (optional)
        /// </summary>
        public string? Context { get; set; }
    }

    /// <summary>
    /// Request đóng session
    /// </summary>
    public class CloseSessionRequest
    {
        /// <summary>
        /// Session ID cần đóng
        /// </summary>
        public string SessionId { get; set; } = string.Empty;

        /// <summary>
        /// Device ID của client
        /// </summary>
        public string DeviceId { get; set; } = string.Empty;
    }
}
