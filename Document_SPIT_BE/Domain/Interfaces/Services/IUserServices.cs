using Domain.Common.Http;
using Domain.Model.Request.User;
using Domain.Model.Response.User;
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
        /// <summary>
        /// Lấy lịch sử hoạt động người dùng theo ID
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task<HttpResponse> GetHistory(long? userId);
        /// <summary>
        /// Lấy danh sách người dùng với phân trang và tìm kiếm
        /// </summary>
        /// <param name="search"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalRecords"></param>
        /// <returns></returns>
        List<UserResponse>? GetUser(string search, int pageNumber, int pageSize, out int totalRecords);
        /// <summary>
        /// Cập nhật thông tin người dùng
        /// </summary>
        /// <param name="userRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> UpdateAsync(long idUser, UserRequest userRequest);
        /// <summary>
        /// Khoá tài khoản người dùng theo ID
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task<HttpResponse> BanAccount(long userId);
        /// <summary>
        /// Tạo mới người dùng
        /// </summary>
        /// <param name="userRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> CreateAsync(UserCreateRequest userRequest);
        /// <summary>
        /// Lấy thông tin người dùng từ token trong Header Authorization
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task<HttpResponse> GetProfileToken();
    }
}
