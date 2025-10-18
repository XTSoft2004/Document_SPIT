using Domain.Interfaces.Mcp;
using Domain.Interfaces.Services;
using Domain.Model.Mcp;
using Domain.Model.Response.Document;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Domain.Services.Mcp
{
    /// <summary>
    /// Service xử lý MCP tools cho search document
    /// </summary>
    public class McpToolService : IMcpToolService
    {
        private readonly IDocumentServices _documentServices;
        private readonly IMcpProgressService _progressService;

        // Các từ khóa để nhận diện search document query
        private readonly List<string> _searchKeywords = new List<string>
        {
            "tìm", "tìm kiếm", "search", "tài liệu", "document", "docs",
            "có tài liệu", "có document", "cho tôi", "give me", "show me",
            "hiển thị", "xem", "view", "danh sách", "list"
        };

        public McpToolService(
            IDocumentServices documentServices,
            IMcpProgressService progressService)
        {
            _documentServices = documentServices;
            _progressService = progressService;
        }

        /// <summary>
        /// Kiểm tra xem query có phải là search document không
        /// </summary>
        public bool IsSearchDocumentQuery(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return false;

            var queryLower = query.ToLower();

            // Kiểm tra xem có chứa các từ khóa không
            return _searchKeywords.Any(keyword => queryLower.Contains(keyword.ToLower()));
        }

        /// <summary>
        /// Thực thi MCP tool dựa trên request
        /// </summary>
        public async Task<McpToolResponse> ExecuteToolAsync(McpToolRequest request)
        {
            try
            {
                switch (request.ToolName.ToLower())
                {
                    case "search_document":
                    case "search_documents":
                        var searchRequest = ParseSearchRequest(request);
                        return await SearchDocumentsAsync(searchRequest);

                    default:
                        return new McpToolResponse
                        {
                            ToolName = request.ToolName,
                            Success = false,
                            ErrorMessage = $"Tool '{request.ToolName}' không được hỗ trợ",
                            SessionId = request.SessionId
                        };
                }
            }
            catch (Exception ex)
            {
                return new McpToolResponse
                {
                    ToolName = request.ToolName,
                    Success = false,
                    ErrorMessage = $"Lỗi khi thực thi tool: {ex.Message}",
                    SessionId = request.SessionId
                };
            }
        }

        /// <summary>
        /// Tìm kiếm tài liệu với progress reporting
        /// </summary>
        public async Task<McpToolResponse> SearchDocumentsAsync(SearchDocumentRequest request)
        {
            var sessionId = request.SessionId ?? _progressService.GenerateSessionId();
            
            try
            {
                // Bước 1: Validating
                await _progressService.SendProgressAsync(new McpProgressUpdate
                {
                    SessionId = sessionId,
                    Step = "validating",
                    Message = "Đang kiểm tra query tìm kiếm...",
                    Progress = 10
                });

                await Task.Delay(300); // Simulate processing

                // Kiểm tra query
                if (string.IsNullOrWhiteSpace(request.Query))
                {
                    return new McpToolResponse
                    {
                        ToolName = "search_document",
                        Success = false,
                        ErrorMessage = "Query không được để trống",
                        SessionId = sessionId
                    };
                }

                // Bước 2: Analyzing
                await _progressService.SendProgressAsync(new McpProgressUpdate
                {
                    SessionId = sessionId,
                    Step = "analyzing",
                    Message = "Đang phân tích yêu cầu tìm kiếm...",
                    Progress = 30
                });

                await Task.Delay(300);

                // Kiểm tra xem có phải search document không
                if (!IsSearchDocumentQuery(request.Query))
                {
                    await _progressService.SendProgressAsync(new McpProgressUpdate
                    {
                        SessionId = sessionId,
                        Step = "completed",
                        Message = "Query không phải là yêu cầu tìm kiếm tài liệu",
                        Progress = 100
                    });

                    return new McpToolResponse
                    {
                        ToolName = "search_document",
                        Success = false,
                        ErrorMessage = "Query không phải là yêu cầu tìm kiếm tài liệu",
                        SessionId = sessionId,
                        Metadata = new Dictionary<string, object>
                        {
                            { "suggestion", "Hãy thử các từ khóa như: 'tìm tài liệu', 'search document', 'cho tôi xem tài liệu'..." }
                        }
                    };
                }

                // Bước 3: Searching
                await _progressService.SendProgressAsync(new McpProgressUpdate
                {
                    SessionId = sessionId,
                    Step = "searching",
                    Message = "Đang tìm kiếm trong cơ sở dữ liệu...",
                    Progress = 50
                });

                await Task.Delay(500);

                // Tìm kiếm trong database
                int totalRecords;
                var documents = _documentServices.GetDocuments(
                    search: request.Query,
                    pageNumber: request.PageNumber,
                    pageSize: request.PageSize,
                    totalRecords: out totalRecords,
                    statusDocument: request.StatusDocument ?? string.Empty
                );

                // Bước 4: Processing results
                await _progressService.SendProgressAsync(new McpProgressUpdate
                {
                    SessionId = sessionId,
                    Step = "processing",
                    Message = $"Đã tìm thấy {totalRecords} tài liệu, đang xử lý kết quả...",
                    Progress = 80,
                    Data = new { totalRecords }
                });

                await Task.Delay(300);

                // Bước 5: Responding
                await _progressService.SendProgressAsync(new McpProgressUpdate
                {
                    SessionId = sessionId,
                    Step = "responding",
                    Message = "Đang chuẩn bị phản hồi...",
                    Progress = 90
                });

                await Task.Delay(200);

                // Hoàn thành
                await _progressService.SendProgressAsync(new McpProgressUpdate
                {
                    SessionId = sessionId,
                    Step = "completed",
                    Message = $"Hoàn tất! Tìm thấy {totalRecords} tài liệu.",
                    Progress = 100,
                    Data = new { totalRecords, resultCount = documents.Count }
                });

                return new McpToolResponse
                {
                    ToolName = "search_document",
                    Success = true,
                    SessionId = sessionId,
                    Result = new
                    {
                        documents = documents,
                        pagination = new
                        {
                            totalRecords = totalRecords,
                            pageNumber = request.PageNumber,
                            pageSize = request.PageSize,
                            totalPages = (int)Math.Ceiling(totalRecords / (double)request.PageSize)
                        }
                    },
                    Metadata = new Dictionary<string, object>
                    {
                        { "totalRecords", totalRecords },
                        { "query", request.Query },
                        { "executionTime", DateTime.Now }
                    }
                };
            }
            catch (Exception ex)
            {
                // Gửi error progress
                await _progressService.SendProgressAsync(new McpProgressUpdate
                {
                    SessionId = sessionId,
                    Step = "error",
                    Message = $"Lỗi: {ex.Message}",
                    Progress = 0
                });

                return new McpToolResponse
                {
                    ToolName = "search_document",
                    Success = false,
                    ErrorMessage = ex.Message,
                    SessionId = sessionId
                };
            }
        }

        /// <summary>
        /// Parse McpToolRequest thành SearchDocumentRequest
        /// </summary>
        private SearchDocumentRequest ParseSearchRequest(McpToolRequest request)
        {
            var searchRequest = new SearchDocumentRequest
            {
                SessionId = request.SessionId
            };

            if (request.Parameters != null)
            {
                if (request.Parameters.ContainsKey("query"))
                    searchRequest.Query = request.Parameters["query"]?.ToString();
                else if (request.Parameters.ContainsKey("search"))
                    searchRequest.Query = request.Parameters["search"]?.ToString();

                if (request.Parameters.ContainsKey("pageNumber"))
                    searchRequest.PageNumber = Convert.ToInt32(request.Parameters["pageNumber"]);

                if (request.Parameters.ContainsKey("pageSize"))
                    searchRequest.PageSize = Convert.ToInt32(request.Parameters["pageSize"]);

                if (request.Parameters.ContainsKey("statusDocument"))
                    searchRequest.StatusDocument = request.Parameters["statusDocument"]?.ToString();
            }

            // Nếu không có query trong parameters, dùng Query từ request
            if (string.IsNullOrEmpty(searchRequest.Query) && !string.IsNullOrEmpty(request.Query))
                searchRequest.Query = request.Query;

            return searchRequest;
        }
    }
}
