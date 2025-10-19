using System;
using System.Collections.Generic;

namespace Domain.Model.Response.Mcp
{
    public class McpQueryResponse
    {
        public string SessionId { get; set; } = string.Empty;
        public string Intent { get; set; } = string.Empty;
        public string Response { get; set; } = string.Empty;
        public List<DocumentSearchResult>? Documents { get; set; }
        public bool Success { get; set; }
        public string? Error { get; set; }
    }

    public class DocumentSearchResult
    {
        public long DocumentId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public string? DocumentName { get; set; }
        public string? FolderId { get; set; }
        public double RelevanceScore { get; set; }
    }
}
