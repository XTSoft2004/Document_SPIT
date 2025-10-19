using Domain.Interfaces.Mcp;
using Domain.Model.Mcp;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Domain.Common.SignalR
{
    /// <summary>
    /// Service quản lý progress updates qua SignalR
    /// </summary>
    public class McpProgressService : IMcpProgressService
    {
        private readonly IHubContext<McpProgressHub> _hubContext;

        public McpProgressService(IHubContext<McpProgressHub> hubContext)
        {
            _hubContext = hubContext;
        }
        public async Task SendProgressAsync(McpProgressUpdate update)
        {
            if (string.IsNullOrEmpty(update.SessionId))
                return;

            await _hubContext.Clients.Group(update.SessionId)
                .SendAsync("ProgressUpdate", update);
        }
        public string GenerateSessionId()
        {
            return Guid.NewGuid().ToString("N");
        }
    }
}
