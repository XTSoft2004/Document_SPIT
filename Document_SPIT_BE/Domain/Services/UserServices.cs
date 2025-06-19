using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.User;
using Domain.Model.Response.User;
using HelperHttpClient;
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
        private readonly IRepositoryBase<UserHistoryResponse>? _history;
        private readonly ITokenServices _tokenServices;
        private UserTokenResponse? userMeToken;
        public UserServices(IRepositoryBase<User>? user, IRepositoryBase<Role>? role, ITokenServices tokenServices)
        {
            _user = user;
            _role = role;
            _tokenServices = tokenServices;
            userMeToken = _tokenServices.GetTokenBrowser();
        }
        public async Task<HttpResponse> GetMe()
        {
            var user = _user!.Find(f => f.Id == userMeToken.Id); 
            if(user == null)
                return HttpResponse.Error(message: "Người dùng không tồn tại.", HttpStatusCode.NotFound);

            return HttpResponse.OK(data: new UserResponse()
            {
                Id = user?.Id,
                Username = user?.Username,
                Fullname = user?.Fullname,
            });
        }
        public async Task<HttpResponse> AddUpdateUser(UserRequest userRequest)
        {
            var user = _user!.Find(f => f.Username == userRequest.Username);
            if(user == null)
            {
                var userCreate = new User()
                {
                    Username = userRequest.Username.Trim(),
                    Fullname = userRequest.Fullname.Trim(),
                    isLocked = userRequest.IsLocked,
                    CreatedDate = DateTime.Now,
                };

                _user.Insert(userCreate);
                await UnitOfWork.CommitAsync();

                return HttpResponse.OK(message: "Thêm người dùng thành công.", data: userCreate);
            }
            else
            {
                user.Username = userRequest.Username.Trim();
                user.Fullname = userRequest.Fullname.Trim();
                user.isLocked = userRequest.IsLocked;
                user.ModifiedDate = DateTime.Now;
                await UnitOfWork.CommitAsync();

                return HttpResponse.OK(message: "Cập nhật người dùng thành công.", data: user);
            }
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
    }
}
