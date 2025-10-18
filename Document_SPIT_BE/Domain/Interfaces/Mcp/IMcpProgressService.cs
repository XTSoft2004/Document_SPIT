using Domain.Model.Mcp;
using System.Threading.Tasks;

namespace Domain.Interfaces.Mcp
{
    /// <summary>
    /// Service để quản lý progress updates
    /// </summary>
    public interface IMcpProgressService
    {
        /// <summary>
        /// Gửi progress update qua SignalR
        /// </summary>
        Task SendProgressAsync(McpProgressUpdate update);

        /// <summary>
        /// Tạo session ID mới
        /// </summary>
        string GenerateSessionId();
    }
}
