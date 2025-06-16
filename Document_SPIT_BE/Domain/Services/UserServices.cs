using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.User;
using HelperHttpClient;
using Microsoft.IdentityModel.Tokens;

namespace Domain.Services
{
    public class UserServices : BaseService, IUserServices
    {
        private readonly IRepositoryBase<User>? _user;
        public UserServices(IRepositoryBase<User>? user)
        {
            _user = user;
        }
        public async Task<HttpResponse> AddUpdateUser(UserRequest userRequest)
        {
            var user = _user!.Find(f => f.UserId == userRequest.UserId && f.Username == userRequest.Username);
            if(user == null)
            {
                var userCreate = new User()
                {
                    UserId = userRequest.UserId,
                    Username = userRequest.Username.Trim(),
                    FullName = userRequest.FullName.Trim(),
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
                user.FullName = userRequest.FullName.Trim();
                user.isLocked = userRequest.IsLocked;
                user.ModifiedDate = DateTime.Now;
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK(message: "Cập nhật người dùng thành công.", data: user);
            }
                
        }
    }
}
