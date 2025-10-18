using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Domain.Common.SignalR
{
    /// <summary>
    /// SignalR Hub để stream progress updates real-time đến client
    /// </summary>
    public class McpProgressHub : Hub
    {
        /// <summary>
        /// Client join vào một session để nhận progress updates
        /// </summary>
        /// <param name="sessionId">Session ID</param>
        public async Task JoinSession(string sessionId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
            await Clients.Caller.SendAsync("JoinedSession", sessionId);
        }

        /// <summary>
        /// Client leave session
        /// </summary>
        /// <param name="sessionId">Session ID</param>
        public async Task LeaveSession(string sessionId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId);
            await Clients.Caller.SendAsync("LeftSession", sessionId);
        }

        /// <summary>
        /// Override OnConnectedAsync để log connection
        /// </summary>
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            // Có thể log connection ở đây nếu cần
        }

        /// <summary>
        /// Override OnDisconnectedAsync để cleanup
        /// </summary>
        public override async Task OnDisconnectedAsync(System.Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
            // Có thể cleanup ở đây nếu cần
        }
    }
}
