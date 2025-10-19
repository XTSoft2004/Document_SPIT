using System;
using System.Collections.Generic;

namespace Domain.Model.Mcp
{
    public class McpToolResponse
    {
        public string ToolName { get; set; }
        public object Result { get; set; }
        public bool Success { get; set; }

        public string? ErrorMessage { get; set; }

        public Dictionary<string, object>? Metadata { get; set; }
        public string? SessionId { get; set; }
    }

    public class McpProgressUpdate
    {
        public string SessionId { get; set; }

        public string Step { get; set; }
        public string Message { get; set; }
        public int Progress { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public object? Data { get; set; }
    }
}
