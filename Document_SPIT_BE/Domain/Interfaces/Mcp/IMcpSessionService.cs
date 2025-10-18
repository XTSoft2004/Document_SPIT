using System.Threading.Tasks;

namespace Domain.Interfaces.Mcp
{
    /// <summary>
    /// Interface quản lý MCP sessions
    /// </summary>
    public interface IMcpSessionService
    {
        /// <summary>
        /// Tạo hoặc lấy session dựa trên deviceId
        /// </summary>
        Task<string> CreateOrGetSessionAsync(string deviceId);

        /// <summary>
        /// Kiểm tra session có hợp lệ không (dựa trên deviceId)
        /// </summary>
        Task<bool> ValidateSessionAsync(string sessionId, string deviceId);

        /// <summary>
        /// Cập nhật context của session
        /// </summary>
        Task UpdateSessionContextAsync(string sessionId, object context);

        /// <summary>
        /// Lấy context của session
        /// </summary>
        Task<object?> GetSessionContextAsync(string sessionId);

        /// <summary>
        /// Đóng session
        /// </summary>
        Task CloseSessionAsync(string sessionId);
        
        /// <summary>
        /// Lấy sessionId từ deviceId (nếu có)
        /// </summary>
        Task<string?> GetSessionIdByDeviceIdAsync(string deviceId);
    }
}
