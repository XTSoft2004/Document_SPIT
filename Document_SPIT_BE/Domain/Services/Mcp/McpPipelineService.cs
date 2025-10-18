using Domain.Common.Gemini.Interfaces;
using Domain.Interfaces.Mcp;
using Domain.Interfaces.Services;
using Domain.Model.Mcp;
using Domain.Model.Request.Mcp;
using Domain.Model.Response.Document;
using Domain.Model.Response.Mcp;
using HelperHttpClient;
using Newtonsoft.Json.Linq;
using Pinecone;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Services.Mcp
{
    /// <summary>
    /// Service xử lý pipeline MCP: analyze_intent -> search_documents -> generate_response
    /// </summary>
    public class McpPipelineService
    {
        private readonly IMcpToolService _mcpToolService;
        private readonly IMcpSessionService _sessionService;
        private readonly IMcpProgressService _progressService;
        private readonly IDocumentServices _documentServices;
        private readonly RequestHttpClient _httpClient;
        private readonly PineconeClient? _pineconeClient;

        public McpPipelineService(
            IMcpToolService mcpToolService,
            IMcpSessionService sessionService,
            IMcpProgressService progressService,
            IDocumentServices documentServices)
        {
            _mcpToolService = mcpToolService;
            _sessionService = sessionService;
            _progressService = progressService;
            _documentServices = documentServices;
            _httpClient = new RequestHttpClient();
            
            // Load environment variables
            var manualPath = Environment.GetEnvironmentVariable("DOTNET_ENV_PATH");
            if (!string.IsNullOrEmpty(manualPath) && File.Exists(manualPath))
            {
                DotNetEnv.Env.Load(manualPath);
            }
            else
            {
                var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
                var parentDir = Directory.GetParent(baseDirectory);
                if (parentDir?.Parent?.Parent?.Parent?.Parent != null)
                {
                    var envPath = Path.Combine(parentDir.Parent.Parent.Parent.Parent.FullName, ".env");
                    if (File.Exists(envPath))
                    {
                        DotNetEnv.Env.Load(envPath);
                    }
                }
            }

            // Initialize Pinecone client
            var pineconeApiKey = Environment.GetEnvironmentVariable("PINECONE_API_KEY");
            if (!string.IsNullOrEmpty(pineconeApiKey))
            {
                _pineconeClient = new PineconeClient(pineconeApiKey);
            }
        }

        /// <summary>
        /// Xử lý query theo pipeline
        /// </summary>
        public async Task<McpQueryResponse> ProcessQueryAsync(McpQueryRequest request, string userId)
        {
            try
            {
                // Step 1: Validate session
                await _progressService.SendProgressAsync(new McpProgressUpdate
                {
                    SessionId = request.SessionId,
                    Step = "validating",
                    Message = "Đang xác thực session...",
                    Progress = 5
                });

                var isValidSession = await _sessionService.ValidateSessionAsync(request.SessionId, userId);
                if (!isValidSession)
                {
                    return new McpQueryResponse
                    {
                        SessionId = request.SessionId,
                        Success = false,
                        Error = "Session không hợp lệ hoặc đã hết hạn"
                    };
                }

                // Step 2: Analyze intent
                await _progressService.SendProgressAsync(new McpProgressUpdate
                {
                    SessionId = request.SessionId,
                    Step = "analyzing",
                    Message = "Đang phân tích ý định của câu hỏi...",
                    Progress = 20
                });

                var intent = await AnalyzeIntentAsync(request.Query);

                // Step 3: Search documents if needed
                List<DocumentSearchResult>? documents = null;
                if (intent.IsDocumentSearch)
                {
                    await _progressService.SendProgressAsync(new McpProgressUpdate
                    {
                        SessionId = request.SessionId,
                        Step = "searching",
                        Message = "Đang tìm kiếm tài liệu...",
                        Progress = 40
                    });

                    documents = await SearchDocumentsAsync(request.Query);

                    await _progressService.SendProgressAsync(new McpProgressUpdate
                    {
                        SessionId = request.SessionId,
                        Step = "processing",
                        Message = $"Đã tìm thấy {documents?.Count ?? 0} tài liệu",
                        Progress = 60
                    });
                }

                // Step 4: Generate response
                await _progressService.SendProgressAsync(new McpProgressUpdate
                {
                    SessionId = request.SessionId,
                    Step = "generating",
                    Message = "Đang tạo câu trả lời...",
                    Progress = 80
                });

                var response = await GenerateResponseAsync(request.Query, intent.Intent, documents);

                // Step 5: Update session context
                await _sessionService.UpdateSessionContextAsync(request.SessionId, new
                {
                    query = request.Query,
                    intent = intent.Intent,
                    timestamp = DateTime.UtcNow,
                    documentsFound = documents?.Count ?? 0
                });

                // Step 6: Complete
                await _progressService.SendProgressAsync(new McpProgressUpdate
                {
                    SessionId = request.SessionId,
                    Step = "completed",
                    Message = "Hoàn tất!",
                    Progress = 100
                });

                return new McpQueryResponse
                {
                    SessionId = request.SessionId,
                    Intent = intent.Intent,
                    Response = response,
                    Documents = documents,
                    Success = true
                };
            }
            catch (Exception ex)
            {
                await _progressService.SendProgressAsync(new McpProgressUpdate
                {
                    SessionId = request.SessionId,
                    Step = "error",
                    Message = $"Lỗi: {ex.Message}",
                    Progress = 0
                });

                return new McpQueryResponse
                {
                    SessionId = request.SessionId,
                    Success = false,
                    Error = ex.Message
                };
            }
        }

        /// <summary>
        /// Phân tích intent bằng Gemini AI
        /// </summary>
        private async Task<(string Intent, bool IsDocumentSearch)> AnalyzeIntentAsync(string query)
        {
            try
            {
                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new
                                {
text = $@"Hãy phân tích câu hỏi sau và xác định intent (ý định):

Câu hỏi: ""{query}""

Trả lời theo format JSON:
{{
  ""intent"": ""<mô tả ngắn gọn intent bằng tiếng Việt>"",
  ""is_document_search"": true/false,
  ""keywords"": [""keyword1"", ""keyword2""]
}}

Các loại intent:
- Tìm kiếm tài liệu: tìm, search, có tài liệu, cho tôi xem, danh sách tài liệu
- Hỏi thông tin: là gì, là ai, giải thích, định nghĩa
- Hỏi đáp chung: chào hỏi, hướng dẫn, cách thức

Yêu cầu keywords:
- Trích xuất các từ khóa quan trọng từ câu hỏi
- Bao gồm tên môn học nếu có
- Bao gồm các khái niệm, chủ đề chính

Chỉ trả lời JSON, không giải thích thêm."
                                }
                            }
                        }
                    }
                };

                string? apiKey = Environment.GetEnvironmentVariable("API_KEY_GEMINI");
                if (string.IsNullOrEmpty(apiKey))
                {
                    return (_mcpToolService.IsSearchDocumentQuery(query) 
                        ? ("Tìm kiếm tài liệu", true) 
                        : ("Hỏi đáp chung", false));
                }

                string url = $"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={apiKey}";
                
                var response = await _httpClient.PostAsync(url, requestBody);

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = JObject.Parse(_httpClient.Content);
                    var resultText = jsonResponse["candidates"]?[0]?["content"]?["parts"]?[0]?["text"]?.ToString();

                    if (!string.IsNullOrEmpty(resultText))
                    {
                        // Parse JSON response
                        var cleanJson = resultText.Trim().Replace("```json", "").Replace("```", "").Trim();
                        var intentData = JObject.Parse(cleanJson);

                        var intent = intentData["intent"]?.ToString() ?? "unknown";
                        var isDocumentSearch = intentData["is_document_search"]?.Value<bool>() ?? false;

                        return (intent, isDocumentSearch);
                    }
                }

                // Fallback: sử dụng keyword matching đơn giản
                return (_mcpToolService.IsSearchDocumentQuery(query) 
                    ? ("Tìm kiếm tài liệu", true) 
                    : ("Hỏi đáp chung", false));
            }
            catch
            {
                // Fallback
                return (_mcpToolService.IsSearchDocumentQuery(query) 
                    ? ("Tìm kiếm tài liệu", true) 
                    : ("Hỏi đáp chung", false));
            }
        }

        /// <summary>
        /// Tìm kiếm tài liệu sử dụng Pinecone vector database
        /// </summary>
        private async Task<List<DocumentSearchResult>> SearchDocumentsAsync(string query)
        {
            try
            {
                if (_pineconeClient == null)
                {
                    return new List<DocumentSearchResult>();
                }

                // Step 1: Tạo embedding từ query text bằng Gemini
                var embedding = await GenerateEmbeddingAsync(query);
                
                if (embedding == null || embedding.Length == 0)
                {
                    return new List<DocumentSearchResult>();
                }

                // Step 2: Query Pinecone sử dụng SDK
                var index = _pineconeClient.Index("spit-document");
                
                // Tạo query request với cú pháp đúng của Pinecone SDK
                var queryRequest = new QueryRequest
                {
                    Vector = embedding.Select(d => (float)d).ToArray(),
                    TopK = 10,
                    IncludeMetadata = true
                };

                var queryResponse = await index.QueryAsync(queryRequest);

                if (queryResponse?.Matches != null)
                {
                    var results = new List<DocumentSearchResult>();

                    foreach (var match in queryResponse.Matches)
                    {
                        // Parse metadata
                        long documentId = 0;
                        string title = string.Empty;
                        string description = string.Empty;

                        if (match.Metadata != null)
                        {
                            if (match.Metadata.TryGetValue("documentId", out var docIdValue))
                            {
                                documentId = Convert.ToInt64(docIdValue);
                            }

                            if (match.Metadata.TryGetValue("courseName", out var titleValue))
                            {
                                title = titleValue?.ToString() ?? string.Empty;
                            }

                            if (match.Metadata.TryGetValue("documentName", out var descValue))
                            {
                                description = descValue?.ToString() ?? string.Empty;
                            }
                        }

                        results.Add(new DocumentSearchResult
                        {
                            DocumentId = documentId,
                            Title = title,
                            Description = description,
                            RelevanceScore = match.Score ?? 0.0
                        });
                    }

                    return results;
                }

                return new List<DocumentSearchResult>();
            }
            catch
            {
                return new List<DocumentSearchResult>();
            }
        }

        /// <summary>
        /// Tạo embedding vector từ text bằng Gemini
        /// </summary>
        private async Task<double[]> GenerateEmbeddingAsync(string text)
        {
            try
            {
                var requestBody = new
                {
                    model = "models/gemini-embedding-001",
                    content = new
                    {
                        parts = new[]
                        {
                            new { text = text }
                        }
                    }
                };

                string? apiKey = Environment.GetEnvironmentVariable("API_KEY_GEMINI");
                if (string.IsNullOrEmpty(apiKey))
                {
                    return Array.Empty<double>();
                }

                string url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key={apiKey}";

                // Add retry logic with exponential backoff for rate limiting
                int maxRetries = 3;
                int retryDelayMs = 1000;

                for (int attempt = 0; attempt < maxRetries; attempt++)
                {
                    var response = await _httpClient.PostAsync(url, requestBody);

                    if (response.IsSuccessStatusCode)
                    {
                        var jsonResponse = JObject.Parse(_httpClient.Content);
                        var values = jsonResponse["embedding"]?["values"];

                        if (values != null)
                        {
                            return values.Select(v => v.Value<double>()).ToArray();
                        }
                    }
                    else if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                    {
                        // Rate limit hit, wait and retry
                        if (attempt < maxRetries - 1)
                        {
                            await Task.Delay(retryDelayMs * (int)Math.Pow(2, attempt));
                            continue;
                        }
                    }
                    else
                    {
                        // Other error, break immediately
                        break;
                    }
                }

                return Array.Empty<double>();
            }
            catch
            {
                return Array.Empty<double>();
            }
        }

        /// <summary>
        /// Generate response bằng Gemini AI
        /// </summary>
        private async Task<string> GenerateResponseAsync(string query, string intent, List<DocumentSearchResult>? documents)
        {
            try
            {
                var documentsInfo = "";
                if (documents != null && documents.Any())
                {
                    documentsInfo = "\n\nTài liệu tìm được:\n" + string.Join("\n", 
                        documents.Select((d, i) => $"{i + 1}. {d.Title} (ID: {d.DocumentId})"));
                }

                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new
                                {
text = $@"Hãy trả lời câu hỏi sau một cách tự nhiên, thân thiện và hữu ích:

Câu hỏi: ""{query}""

Intent đã phân tích: {intent}
{documentsInfo}

Yêu cầu:
- Trả lời bằng tiếng Việt
- Ngắn gọn, súc tích (2-3 câu)
- Nếu có tài liệu, hãy liệt kê danh sách các tài liệu tìm được với định dạng:
  * Tên tài liệu
  Sau đó giới thiệu ngắn gọn về kết quả tìm kiếm
- Nếu không có tài liệu hoặc không tìm thấy, hãy gợi ý người dùng cách tìm kiếm tốt hơn

Chỉ trả lời nội dung, không thêm phần giải thích hay format đặc biệt."
                                }
                            }
                        }
                    }
                };

                string? apiKey = Environment.GetEnvironmentVariable("API_KEY_GEMINI");
                if (string.IsNullOrEmpty(apiKey))
                {
                    if (documents != null && documents.Any())
                    {
                        return $"Tôi đã tìm thấy {documents.Count} tài liệu liên quan đến \"{query}\". Bạn có thể xem danh sách bên dưới.";
                    }
                    else
                    {
                        return $"Xin lỗi, tôi không tìm thấy tài liệu nào liên quan đến \"{query}\". Hãy thử sử dụng từ khóa khác hoặc mô tả rõ hơn.";
                    }
                }

                string url = $"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={apiKey}";
                
                var response = await _httpClient.PostAsync(url, requestBody);

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = JObject.Parse(_httpClient.Content);
                    var resultText = jsonResponse["candidates"]?[0]?["content"]?["parts"]?[0]?["text"]?.ToString();

                    if (!string.IsNullOrEmpty(resultText))
                    {
                        return resultText.Trim();
                    }
                }

                // Fallback response
                if (documents != null && documents.Any())
                {
                    return $"Tôi đã tìm thấy {documents.Count} tài liệu liên quan đến \"{query}\". Bạn có thể xem danh sách bên dưới.";
                }
                else
                {
                    return $"Xin lỗi, tôi không tìm thấy tài liệu nào liên quan đến \"{query}\". Hãy thử sử dụng từ khóa khác hoặc mô tả rõ hơn.";
                }
            }
            catch
            {
                // Fallback response
                if (documents != null && documents.Any())
                {
                    return $"Đã tìm thấy {documents.Count} tài liệu.";
                }
                return "Đã xảy ra lỗi khi tạo câu trả lời. Vui lòng thử lại.";
            }
        }
    }
}
