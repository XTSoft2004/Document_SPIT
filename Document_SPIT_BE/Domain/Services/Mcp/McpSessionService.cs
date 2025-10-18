using Domain.Interfaces.Mcp;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Services.Mcp
{
    /// <summary>
    /// Service quản lý MCP sessions dựa trên deviceId
    /// </summary>
    public class McpSessionService : IMcpSessionService
    {
        private readonly ConcurrentDictionary<string, McpSession> _sessions = new();
        private readonly ConcurrentDictionary<string, string> _deviceToSession = new(); // deviceId -> sessionId mapping
        private readonly TimeSpan _sessionTimeout = TimeSpan.FromMinutes(30);

        public Task<string> CreateOrGetSessionAsync(string deviceId)
        {
            // Kiểm tra xem deviceId đã có session hay chưa
            if (_deviceToSession.TryGetValue(deviceId, out var existingSessionId))
            {
                if (_sessions.TryGetValue(existingSessionId, out var existingSession))
                {
                    // Kiểm tra session còn hợp lệ không
                    if (DateTime.UtcNow - existingSession.LastAccessedAt <= _sessionTimeout)
                    {
                        existingSession.LastAccessedAt = DateTime.UtcNow;
                        return Task.FromResult(existingSessionId);
                    }
                    else
                    {
                        // Session hết hạn, xóa đi
                        _sessions.TryRemove(existingSessionId, out _);
                        _deviceToSession.TryRemove(deviceId, out _);
                    }
                }
            }

            // Tạo session mới
            var sessionId = Guid.NewGuid().ToString();
            var session = new McpSession
            {
                SessionId = sessionId,
                DeviceId = deviceId,
                CreatedAt = DateTime.UtcNow,
                LastAccessedAt = DateTime.UtcNow,
                Context = new Dictionary<string, object>()
            };

            _sessions.TryAdd(sessionId, session);
            _deviceToSession.TryAdd(deviceId, sessionId);
            
            return Task.FromResult(sessionId);
        }

        public Task<bool> ValidateSessionAsync(string sessionId, string deviceId)
        {
            if (!_sessions.TryGetValue(sessionId, out var session))
                return Task.FromResult(false);

            // Kiểm tra deviceId có khớp không
            if (session.DeviceId != deviceId)
                return Task.FromResult(false);

            // Kiểm tra timeout
            if (DateTime.UtcNow - session.LastAccessedAt > _sessionTimeout)
            {
                _sessions.TryRemove(sessionId, out _);
                _deviceToSession.TryRemove(deviceId, out _);
                return Task.FromResult(false);
            }

            session.LastAccessedAt = DateTime.UtcNow;
            return Task.FromResult(true);
        }

        public Task UpdateSessionContextAsync(string sessionId, object context)
        {
            if (_sessions.TryGetValue(sessionId, out var session))
            {
                session.Context["lastQuery"] = context;
                session.LastAccessedAt = DateTime.UtcNow;
            }
            return Task.CompletedTask;
        }

        public Task<object?> GetSessionContextAsync(string sessionId)
        {
            if (_sessions.TryGetValue(sessionId, out var session))
            {
                return Task.FromResult<object?>(session.Context);
            }
            return Task.FromResult<object?>(null);
        }

        public Task CloseSessionAsync(string sessionId)
        {
            if (_sessions.TryGetValue(sessionId, out var session))
            {
                _deviceToSession.TryRemove(session.DeviceId, out _);
            }
            _sessions.TryRemove(sessionId, out _);
            return Task.CompletedTask;
        }

        public Task<string?> GetSessionIdByDeviceIdAsync(string deviceId)
        {
            if (_deviceToSession.TryGetValue(deviceId, out var sessionId))
            {
                // Kiểm tra session còn tồn tại và hợp lệ không
                if (_sessions.TryGetValue(sessionId, out var session))
                {
                    if (DateTime.UtcNow - session.LastAccessedAt <= _sessionTimeout)
                    {
                        return Task.FromResult<string?>(sessionId);
                    }
                }
            }
            return Task.FromResult<string?>(null);
        }

        private class McpSession
        {
            public string SessionId { get; set; } = string.Empty;
            public string DeviceId { get; set; } = string.Empty;
            public DateTime CreatedAt { get; set; }
            public DateTime LastAccessedAt { get; set; }
            public Dictionary<string, object> Context { get; set; } = new();
        }
    }
}
