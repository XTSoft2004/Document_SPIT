using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Common.HttpRequest;
using Domain.Entities;
using Domain.Interfaces.Common;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Auth;
using Domain.Model.Request.TokenUser;
using Domain.Model.Request.User;
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
        private readonly IUserServices? _userServices;
        private readonly IRepositoryBase<TokenUser>? _token;
        private readonly IRepositoryBase<User>? _user;
        private UserTokenResponse? userMeToken;  
        public AuthServices(ITokenServices? tokenServices, IUserServices? userServices, IRepositoryBase<TokenUser>? token, IRepositoryBase<User>? user)
        {
            _tokenServices = tokenServices;
            _userServices = userServices;
            _token = token;
            _user = user;
            userMeToken = _tokenServices.GetTokenBrowser();
        }

        public async Task<HttpResponse> LoginUser(LoginRequest loginRequest)
        {
            var jsonData = new LoginDTO()
            {
                Username = loginRequest.Username?.Trim() ?? string.Empty,
                Password = loginRequest.Password?.Trim() ?? string.Empty,
            };

            var response = await HttpRequest._client.PostAsync("auth/login", jsonData);
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

                    #region Xử lý người dùng
                    // Kiểm tra người dùng đã tồn tại trong hệ thống chưa, nếu chưa thì thêm mới
                    await _userServices.AddUpdateUser(new UserRequest()
                    {
                        UserId = userId,
                        Username = username,
                        FullName = fullName,
                        IsLocked = isLocker,
                    });
                    #endregion

                    #region Xử lý token của người dùng
                    // Tạo JWT token và Refresh Token cho người dùng
                    TokenResponse tokenResponse = _tokenServices.GenerateToken(new UserResponse()
                    {
                        UserId = userId,
                        Username = username,
                        FullName = fullName,
                    }, loginRequest.DeviceId!);

                    // Nếu người dùng mới thì tạo mới Refresh Token, ngược lại thì cập nhật Refresh Token
                    await _tokenServices.UpdateRefreshToken(new TokenRequest()
                    {
                        UserId = userId,
                        Token = tokenResponse.RefreshToken,
                        ExpiryDate = tokenResponse.RefreshExpiresAt,
                        DeviceId = loginRequest.DeviceId!
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
        public async Task<HttpResponse> LogoutUser()
        {
            var user = _user!.Find(f => f.UserId == userMeToken!.UserId);
            if(user == null)
                return HttpResponse.OK(message: "Người dùng không tồn tại.");
            var tokenAll = _token.All().ToList();
            // Xóa token đăng nhập của người dùng theo deviceId
            var tokenUser = _token.Find(f => f.UserId == userMeToken!.UserId && f.DeviceId == userMeToken!.DeviceId);
            if (tokenUser == null)
                return HttpResponse.OK(message: "Người dùng không có token đăng nhập.");

            _token.Delete(tokenUser);
            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: "Đăng xuất thành công.");
        }
    }
}
