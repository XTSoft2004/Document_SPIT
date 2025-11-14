namespace Domain.Model.Request.Mcp
{
    public class CreateSessionRequest
    {
        public string DeviceId { get; set; } = string.Empty;
    }
    public class McpQueryRequest
    {
        public string SessionId { get; set; } = string.Empty;
        public string DeviceId { get; set; } = string.Empty;
        public string Query { get; set; } = string.Empty;
        public string? Context { get; set; }
    }
    public class CloseSessionRequest
    {
        public string SessionId { get; set; } = string.Empty;
        public string DeviceId { get; set; } = string.Empty;
    }
}
