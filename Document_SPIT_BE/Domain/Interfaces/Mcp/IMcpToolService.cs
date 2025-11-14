using Domain.Model.Mcp;
using System.Threading.Tasks;

namespace Domain.Interfaces.Mcp
{
    /// <summary>
    /// Interface cho MCP Tool Service
    /// </summary>
    public interface IMcpToolService
    {
        /// <summary>
        /// Thực thi MCP tool
        /// </summary>
        Task<McpToolResponse> ExecuteToolAsync(McpToolRequest request);

        /// <summary>
        /// Kiểm tra xem query có phải là search document không
        /// </summary>
        bool IsSearchDocumentQuery(string query);

        /// <summary>
        /// Tìm kiếm tài liệu
        /// </summary>
        Task<McpToolResponse> SearchDocumentsAsync(SearchDocumentRequest request);
    }
}
