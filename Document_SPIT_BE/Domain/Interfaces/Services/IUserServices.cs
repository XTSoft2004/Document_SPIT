using Domain.Common.Http;
using Domain.Model.Request.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IUserServices
    {
        /// <summary>
        /// Thêm và cập nhật người dùng
        /// </summary>
        /// <param name="userRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> AddUpdateUser(UserRequest userRequest);
        /// <summary>
        /// Set quyền cho người dùng
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task<HttpResponse> SetRole(long? userId, string roleName);
        /// <summary>
        /// Lấy thông của người dùng hiện tại
        /// </summary>
        /// <returns></returns>
        Task<HttpResponse> GetMe();
    }
}
