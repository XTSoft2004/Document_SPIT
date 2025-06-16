using Domain.Common.Http;
using Domain.Model.Request.TokenUser;
using Domain.Model.Response.Token;
using Domain.Model.Response.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface ITokenServices
    {
        /// <summary>
        /// Tạo JWT token và Refresh Token cho người dùng
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        TokenResponse GenerateToken(UserResponse user, string deviceId);
        /// <summary>
        /// Tạo JWT token cho người dùng
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        string GenerateTokenUser(UserResponse user, string deviceId);
        /// <summary>
        /// Tạo Refresh Token cho người dùng
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        string GenerateRefreshToken(UserResponse user, string deviceId);
        /// <summary>
        /// Lấy thông tin người dùng qua token
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        UserTokenResponse GetInfoFromToken(string token);
        /// <summary>
        /// Lấy thời gian hết hạn từ token
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        DateTime GetDateTimeFormToken(string token);
        /// <summary>
        /// Lấy Refresh Token của người dùng theo UserId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        string GetRefreshToken(long? userId);
        /// <summary>
        /// Cập nhật Refresh Token cho người dùng
        /// </summary>
        /// <param name="info"></param>
        /// <returns></returns>
        Task<HttpResponse> UpdateRefreshToken(TokenRequest info);
        /// <summary>
        /// Lấy thông tin người dùng từ token trong Header Authorization
        /// </summary>
        /// <returns></returns>
        UserTokenResponse? GetTokenBrowser();
    }
}
