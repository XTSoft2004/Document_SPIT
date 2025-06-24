using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.User;
using Domain.Model.Response.User;
using HelperHttpClient;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class UserServices : BaseService, IUserServices
    {
        private readonly IRepositoryBase<User>? _user;
        private readonly IRepositoryBase<Role>? _role;
        private readonly IRepositoryBase<History>? _history;
        private readonly ITokenServices _tokenServices;
        private UserTokenResponse? userMeToken;
        public UserServices(IRepositoryBase<User>? user, IRepositoryBase<Role>? role, ITokenServices tokenServices, IRepositoryBase<History>? history)
        {
            _user = user;
            _role = role;
            _history = history;
            _tokenServices = tokenServices;
            userMeToken = _tokenServices.GetTokenBrowser();
        }
        public async Task<HttpResponse> UpdateAsync(long idUser, UserRequest userRequest)
        {
            var user = _user!.Find(f => f.Id == idUser);
            if (user == null)
                return HttpResponse.Error(message: "Người dùng không tồn tại.", HttpStatusCode.NotFound);

            user.Fullname = userRequest.Fullname ?? user.Fullname;
            user.Password = !string.IsNullOrEmpty(userRequest.Password) ? userRequest.Password : user.Password;
            user.ModifiedDate = DateTime.Now;

            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: "Cập nhật người dùng thành công.");
        }
        public async Task<HttpResponse> GetMe()
        {
            if (userMeToken == null)
                return HttpResponse.Error(message: "Không tìm thấy thông tin người dùng.", HttpStatusCode.Unauthorized);

            var user = _user!.Find(f => f.Id == userMeToken.Id);
            if (user == null)
                return HttpResponse.Error(message: "Người dùng không tồn tại.", HttpStatusCode.NotFound);

            return HttpResponse.OK(data: new UserResponse()
            {
                Id = user?.Id,
                Username = user?.Username,
                Fullname = user?.Fullname,
            });
        }
        public async Task<HttpResponse> SetRole(long? userId, string roleName)
        {
            var user = _user!.Find(f => f.Id == userId);
            if (user == null)
                return HttpResponse.OK(message: "Người dùng không tồn tại.");

            var role = _role!.Find(f => f.DisplayName == roleName);
            if (role != null)
            {
                user.RoleId = role.Id;
                user.Role = role;
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: $"Cập nhật role {role.DisplayName} thành công!");
            }

            return HttpResponse.Error(message: "Không tìm thấy quyền.", HttpStatusCode.NotFound);
        }
        public async Task<HttpResponse> GetHistory(long? userId)
        {
            var user = _user!.Find(f => f.Id == userId);
            if (user == null)
                return HttpResponse.Error(message: "Người dùng không tồn tại.", HttpStatusCode.NotFound);

            var history = _history!.All().Where(w => w.UserId == userId).ToList();

            return HttpResponse.OK(message: "Lấy lịch sử người dùng thành công.", data: history);
        }
        public List<UserResponse>? GetUser(string search, int pageNumber, int pageSize, out int totalRecords)
        {
            var query = _user.All();

            if (!string.IsNullOrEmpty(search))
            {
                string searchLower = search.ToLower();
                query = query.Where(u => u.Username.ToLower().Contains(searchLower) ||
                    u.Fullname.ToLower().Contains(searchLower) ||
                    (u.Role != null && u.Role.DisplayName != null && u.Role.DisplayName.ToLower().Contains(searchLower)) ||
                    u.Role!.DisplayName!.Contains(searchLower) ||
                    (u.isLocked ? "đã khoá" : "hoạt động").Contains(searchLower));
            }

            // Đếm số bản ghi trước khi phân trang
            totalRecords = query.Count();

            // Sắp xếp theo ID
            query = query.OrderByDescending(u => u.ModifiedDate);

            if (pageNumber != -1 && pageSize != -1)
            {
                query = query.Skip((pageNumber - 1) * pageSize).Take(pageSize);
            }

            // Chuyển đổi sang danh sách UserResponse
            var usersSearch = query.Select(s => new UserResponse()
            {
                Id = s.Id,
                Username = s.Username,
                Fullname = s.Fullname,
                IsLocked = s.isLocked,
                RoleName = s.Role != null ? s.Role.DisplayName : "Chưa phân quyền"
            }).ToList();

            return usersSearch;
        }
        public async Task<HttpResponse> BanAccount(long userId)
        {
            var user = _user!.Find(f => f.Id == userId);
            if (user == null)
                return HttpResponse.Error(message: "Người dùng không tồn tại.", HttpStatusCode.NotFound);

            user.isLocked = !user.isLocked;
            user.ModifiedDate = DateTime.Now;
            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: user.isLocked ? "Khoá tài khoản thành công." : "Mở khoá tài khoản thành công.");
        }
        public async Task<HttpResponse> CreateAsync(UserCreateRequest userRequest)
        {
            if (userRequest == null)
                return HttpResponse.Error(message: "Thông tin người dùng không hợp lệ.", HttpStatusCode.BadRequest);

            var role = _role!.Find(f => f.DisplayName == "User");

            var user = new User()
            {
                Username = userRequest.Username,
                Fullname = userRequest.Fullname,
                Password = userRequest.Password,
                CreatedDate = DateTime.Now,
                ModifiedDate = DateTime.Now,
                isLocked = false,
                Role = role,
                RoleId = role.Id,
            };
            _user!.Insert(user);
            await UnitOfWork.CommitAsync()
                ;
            return HttpResponse.OK(message: "Tạo người dùng thành công.");
        }
    } 
}