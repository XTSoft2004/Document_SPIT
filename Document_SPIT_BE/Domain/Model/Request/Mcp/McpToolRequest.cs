using System;
using System.Collections.Generic;

namespace Domain.Model.Mcp
{
    public class McpToolRequest
    {
        public string ToolName { get; set; }
        public Dictionary<string, object> Parameters { get; set; }
        public string? SessionId { get; set; }
        public string? Query { get; set; }
    }
    public class SearchDocumentRequest
    {
        public string Query { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? StatusDocument { get; set; }
        public string? SessionId { get; set; }
    }
}
