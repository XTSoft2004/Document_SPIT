using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Common.HttpRequest;
using Domain.Interfaces.Services;
using Domain.Model.Request.Auth;
using Domain.Model.Response.Auth;
using Domain.Model.Response.Token;
using Domain.Model.Response.User;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class AuthServices : BaseService, IAuthServices
    {
        private readonly ITokenServices? _tokenServices;

        public AuthServices(ITokenServices? tokenServices)
        {
            _tokenServices = tokenServices;
        }

        public async Task<HttpResponse> LoginUser(LoginRequest loginRequest)
        {
            var response = await HttpRequest._client.PostAsync("auth/login", loginRequest);
            if (response.IsSuccessStatusCode)
            {
                string jsonReponse = HttpRequest.GetResponse(response);
                var dataJson = JObject.Parse(jsonReponse)["data"];
                if (dataJson != null)
                {
                    string username = dataJson["username"]?.ToString() ?? string.Empty;
                    string fullName = dataJson["studentName"]?.ToString() ?? string.Empty;
                    long userId = dataJson["id"]?.ToObject<long>() ?? 0;
                    bool isLocker = dataJson["isLocker"]?.ToObject<bool>() ?? false;

                    #region Xử lý token của người dùng
                    TokenResponse tokenResponse = _tokenServices.GenerateToken(new UserResponse()
                    {
                        UserId = userId,
                        Username = username,
                        FullName = fullName,
                    });
                    #endregion

                    var loginResponse = new LoginResponse
                    {
                        UserId = userId,
                        Username = username,
                        FullName = fullName,
                        isLocker = isLocker,
                        AccessToken = tokenResponse.AccessToken,
                        ExpiresAt = tokenResponse.ExpiresAt,
                        RefreshToken = tokenResponse.RefreshToken,
                        RefreshExpiresAt = tokenResponse.RefreshExpiresAt
                    };

                    return HttpResponse.OK(message: "Đăng nhập thành công.", data: loginResponse);
                }
            }
            return HttpResponse.OK(message: "Đăng nhập thất bại!!");
        }
    }
}
