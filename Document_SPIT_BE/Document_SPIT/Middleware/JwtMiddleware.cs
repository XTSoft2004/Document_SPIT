using Domain.Entities;
using Domain.Interfaces.Services;
//using Domain.Model.Response.Auth;
using Domain.Model.Response.User;
using Domain.Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace Server_Manager.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _secretKey;
        private readonly ITokenServices _tokenServices;
        private readonly IUserServices _userServices;
        public JwtMiddleware(RequestDelegate next, IConfiguration config, ITokenServices tokenServices, IUserServices userServices)
        {
            _next = next;
            _secretKey = config["JwtSettings:Secret"];
            _tokenServices = tokenServices;
            _userServices = userServices;
        }

        public async Task Invoke(HttpContext context)
        {
            var bypassRoutes = new[]
            {
                "/auth/login",
                "/auth/register",
                "/auth/sign-up",
                "/auth/refresh-token",
                "/document/view",
                "/extension/",
                "/auth/logout",
                "/extension/upload",
                "/extension/image",
                "/extension/base64",
                "/driver/upload",
                "/driver/preview",
                "/driver/find",
                "/driver/tree",
                "/document/download",
                "/document",
                "/document/preview",
                "/document/recent",
                "/statistical/ranking",
                "/statistical/parameter-document",
                "/user/profile",
                "/server",
            };

            var requestPath = context.Request.Path.Value?.ToLower() ?? string.Empty;
            if (bypassRoutes.Any(route => requestPath.Contains(route)))
            {
                await _next(context);
                return;
            }

            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new { Message = "Token không hợp lệ hoặc không tồn tại" });
                return;
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();

            try
            {
                var dateTimeNow = DateTime.Now;

                UserTokenResponse AuthInfo = _tokenServices.GetInfoFromToken(token);
                if(AuthInfo == null || AuthInfo.ExpiryDate < dateTimeNow)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsJsonAsync(new { Message = "Token không hợp lệ hoặc đã hết hạn" });
                    return;
                }

                var refresh_token_old = _tokenServices.GetRefreshToken(AuthInfo.Id);
                UserTokenResponse AuthRefreshToken = _tokenServices.GetInfoFromToken(refresh_token_old);
                if (AuthRefreshToken?.ExpiryDate < dateTimeNow)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsJsonAsync(new { Message = "Refresh Token đã hết hạn" });
                    return;
                }

                await _next(context);

                if (context.Response.StatusCode == (int)StatusCodes.Status403Forbidden)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    await context.Response.WriteAsJsonAsync(new { Message = "Bạn không có quyền truy cập tài nguyên này!" });
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new { Message = "Token không hợp lệ hoặc đã hết hạn" });
            }
        }
    }
}
