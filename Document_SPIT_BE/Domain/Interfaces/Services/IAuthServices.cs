using Domain.Common.Http;
using Domain.Model.Request.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IAuthServices
    {
        /// <summary>
        /// Đăng nhập người dùng    
        /// </summary>
        /// <param name="loginRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> LoginUser(LoginRequest loginRequest);
        /// <summary>
        /// Đăng xuất người dùng
        /// </summary>
        /// <returns></returns>
        Task<HttpResponse> LogoutUser();
        /// <summary>
        /// Tạo tài khoản người dùng
        /// </summary>
        /// <param name="registerRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> RegisterAsync(RegisterRequest registerRequest);
        /// <summary>
        /// Refresh token người dùng
        /// </summary>
        /// <returns></returns>
        Task<HttpResponse> RefreshTokenAccount();
    }
}
