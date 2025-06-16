using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Base.Services;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using HelperHttpClient;

namespace Domain.Services
{
    public class UserServices : BaseService
    {
        private readonly IRepositoryBase<User>? _user;
        public UserServices(IRepositoryBase<User>? user)
        {
            _user = user;
        }

        //public async Task<User> GetUserByIdAsync(long userId)
        //{
        //    var response = await _request.GetAsync($"{API_SERVER}/student?")
        //}
    }
}
