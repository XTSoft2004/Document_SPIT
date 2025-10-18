using Domain.Common;
using Domain.Interfaces.Mcp;
using Domain.Model.Mcp;
using Domain.Model.Request.Mcp;
using Domain.Services.Mcp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Document_SPIT.Controllers
{
    /// <summary>
    /// Controller xử lý MCP requests với session-based flow dựa trên deviceId
    /// </summary>
    [ApiController]
    [Route("mcp")]
    public class McpController : ControllerBase
    {
        private readonly IMcpToolService _mcpToolService;
        private readonly IMcpProgressService _progressService;
        private readonly IMcpSessionService _sessionService;
        private readonly McpPipelineService _pipelineService;

        public McpController(
            IMcpToolService mcpToolService,
            IMcpProgressService progressService,
            IMcpSessionService sessionService,
            McpPipelineService pipelineService)
        {
            _mcpToolService = mcpToolService;
            _progressService = progressService;
            _sessionService = sessionService;
            _pipelineService = pipelineService;
        }

        /// <summary>
        /// Tạo hoặc lấy MCP session dựa trên deviceId
        /// </summary>
        [HttpPost("session/create")]
        public async Task<IActionResult> CreateSession([FromBody] CreateSessionRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.DeviceId))
                {
                    return BadRequest(new { message = "DeviceId không được để trống" });
                }

                var sessionId = await _sessionService.CreateOrGetSessionAsync(request.DeviceId);
                return Ok(new
                {
                    sessionId,
                    deviceId = request.DeviceId,
                    message = "Session created/retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = "Internal server error",
                    message = ex.Message
                });
            }
        }

        /// <summary>
        /// Đóng MCP session
        /// </summary>
        [HttpPost("session/close")]
        public async Task<IActionResult> CloseSession([FromBody] CloseSessionRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.SessionId))
                {
                    return BadRequest(new { message = "SessionId không được để trống" });
                }

                if (string.IsNullOrWhiteSpace(request.DeviceId))
                {
                    return BadRequest(new { message = "DeviceId không được để trống" });
                }

                var isValid = await _sessionService.ValidateSessionAsync(request.SessionId, request.DeviceId);
                if (!isValid)
                {
                    return BadRequest(new { message = "Invalid session or deviceId mismatch" });
                }

                await _sessionService.CloseSessionAsync(request.SessionId);
                return Ok(new { message = "Session closed successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = "Internal server error",
                    message = ex.Message
                });
            }
        }

        /// <summary>
        /// Xử lý query MCP với pipeline flow: analyze_intent -> search_documents -> generate_response
        /// </summary>
        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] McpQueryRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.SessionId))
                {
                    return BadRequest(new { message = "SessionId không được để trống" });
                }

                if (string.IsNullOrWhiteSpace(request.DeviceId))
                {
                    return BadRequest(new { message = "DeviceId không được để trống" });
                }

                if (string.IsNullOrWhiteSpace(request.Query))
                {
                    return BadRequest(new { message = "Query không được để trống" });
                }

                // Validate session với deviceId
                var isValid = await _sessionService.ValidateSessionAsync(request.SessionId, request.DeviceId);
                if (!isValid)
                {
                    return BadRequest(new { message = "Invalid session or deviceId mismatch" });
                }

                // Lấy userId nếu có (từ token), nếu không thì dùng deviceId
                var userId = HttpContextHelper.GetUserId(HttpContext);
                if (string.IsNullOrEmpty(userId))
                {
                    userId = request.DeviceId; // Dùng deviceId làm userId cho anonymous users
                }

                var response = await _pipelineService.ProcessQueryAsync(request, userId);

                if (!response.Success)
                {
                    return BadRequest(response);
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = "Internal server error",
                    message = ex.Message
                });
            }
        }
    }
}
