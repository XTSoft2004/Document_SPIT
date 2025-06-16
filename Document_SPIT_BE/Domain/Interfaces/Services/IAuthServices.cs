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
        Task<HttpResponse> LoginUser(LoginRequest loginRequest);
    }
}
