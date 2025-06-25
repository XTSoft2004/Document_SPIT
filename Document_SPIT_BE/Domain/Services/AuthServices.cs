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
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
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
        public async Task<HttpResponse> RegisterAsync(RegisterRequest registerRequest)
        {
            var user = _user!.Find(f => f.Username == registerRequest.Username.Trim());
            if (user != null)
                return HttpResponse.OK(message: "Tên đăng nhập đã tồn tại.");

            var response = await HttpRequest._client.PostAsync("auth/login", new Dictionary<string, string?>
            {
                { "username", registerRequest.Username?.Trim() ?? string.Empty },
                { "password", registerRequest.Password?.Trim() ?? string.Empty }
            });
            if (!response.IsSuccessStatusCode)
            {
                _user.Insert(new User()
                {
                    Username = registerRequest.Username.Trim(),
                    Password = registerRequest.Password.Trim(),
                    Fullname = registerRequest.Fullname.Trim(),
                    isLocked = false,
                    CreatedDate = DateTime.Now,
                });
                await UnitOfWork.CommitAsync();

                return HttpResponse.OK(message: "Đăng ký thành công.");
            }

            // Nếu đăng ký không thành công thì trả về thông báo lỗi từ server CLB SPIT
            return HttpResponse.OK(message: "Tên đăng nhập đã tồn tại trên server CLB SPIT, vui lòng chọn tên khác.");
        }
        public async Task<HttpResponse> LoginUser(LoginRequest loginRequest)
        {
            var jsonData = new LoginDTO()
            {
                Username = loginRequest.Username?.Trim() ?? string.Empty,
                Password = loginRequest.Password?.Trim() ?? string.Empty,
            };
            User? user = null;

            // Kiểm tra thông tin đăng nhập có hợp lệ ở server CLB SPIT hay không
            var response = await HttpRequest._client.PostAsync("auth/login", jsonData);
            if (response.IsSuccessStatusCode)
            {
                string jsonReponse = HttpRequest.GetResponse(response);
                var dataJson = JObject.Parse(jsonReponse)["data"];
                if (dataJson != null)
                {
                    string username = dataJson["username"]?.ToString() ?? string.Empty;
                    string Fullname = dataJson["studentName"]?.ToString() ?? string.Empty;
                    long userId = dataJson["id"]?.ToObject<long>() ?? 0;
                    bool isLocked = dataJson["isLocked"]?.ToObject<bool>() ?? false;

                    user = _user!.Find(f => f.Username == username.Trim());
                    if(user == null)
                    {
                        await RegisterAsync(new RegisterRequest()
                        {
                            Username = username.Trim(),
                            Password = loginRequest.Password!.Trim(),
                            Fullname = Fullname.Trim()
                        });

                        await _userServices.SetRole(userId, "Admin");
                    }
                }
            }

            if(user == null)
            {
                user = _user!.Find(f => f.Username == loginRequest.Username.Trim() && f.Password == loginRequest.Password.Trim());
                if (user == null)
                    return HttpResponse.Error(message: "Thông tin đăng nhập không hợp lệ.", HttpStatusCode.BadRequest);
            }

            #region Xử lý token của người dùng
            // Tạo JWT token và Refresh Token cho người dùng
            TokenResponse tokenResponse = _tokenServices.GenerateToken(new UserResponse()
            {
                Id = user.Id,
                Username = user.Username,
                Fullname = user.Fullname,
            }, loginRequest.DeviceId!);

            // Nếu người dùng mới thì tạo mới Refresh Token, ngược lại thì cập nhật Refresh Token
            await _tokenServices.UpdateRefreshToken(new TokenRequest()
            {
                UserId = user.Id,
                Token = tokenResponse.RefreshToken,
                ExpiryDate = tokenResponse.RefreshExpiresAt,
                DeviceId = loginRequest.DeviceId!
            });
            #endregion

            var loginResponse = new LoginResponse
            {
                UserId = user.Id,
                Username = user.Username,
                Fullname = user.Fullname,
                isLocked = user.isLocked,
                AccessToken = tokenResponse.AccessToken,
                ExpiresAt = tokenResponse.ExpiresAt,
                RefreshToken = tokenResponse.RefreshToken,
                RefreshExpiresAt = tokenResponse.RefreshExpiresAt
            };

            return HttpResponse.OK(message: "Đăng nhập thành công.",data: loginResponse);
        }
        public async Task<HttpResponse> LogoutUser()
        {
            var user = _user!.Find(f => f.Id == userMeToken!.Id);
            if(user == null)
                return HttpResponse.OK(message: "Người dùng không tồn tại.");
            var tokenAll = _token.All().ToList();
            // Xóa token đăng nhập của người dùng theo deviceId
            var tokenUser = _token.Find(f => f.UserId == userMeToken!.Id && f.DeviceId == userMeToken!.DeviceId);
            if (tokenUser == null)
                return HttpResponse.OK(message: "Người dùng không có token đăng nhập.");

            _token.Delete(tokenUser);
            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: "Đăng xuất thành công.");
        }
        public async Task<HttpResponse> RefreshTokenAccount()
        {
            if (userMeToken == null)
                return HttpResponse.Error(message: "Không tìm thấy thông tin người dùng.", HttpStatusCode.Unauthorized);

            var user = _user!.Find(f => f.Id == userMeToken.Id);
            // Tạo JWT token và Refresh Token cho người dùng
            TokenResponse tokenResponse = _tokenServices.GenerateToken(new UserResponse()
            {
                Id = user.Id,
                Username = user.Username,
                Fullname = user.Fullname,
            }, userMeToken.DeviceId!);

            // Nếu người dùng mới thì tạo mới Refresh Token, ngược lại thì cập nhật Refresh Token
            await _tokenServices.UpdateRefreshToken(new TokenRequest()
            {
                UserId = user.Id,
                Token = tokenResponse.RefreshToken,
                ExpiryDate = tokenResponse.RefreshExpiresAt,
                DeviceId = userMeToken.DeviceId!
            });

            return HttpResponse.OK(message: "Làm mới token thành công.", data: new TokenInfoResponse()
            {
                UserId = user.Id,
                AccessToken = tokenResponse.AccessToken,
                RefreshExpiresAt = tokenResponse.RefreshExpiresAt,
                RefreshToken = tokenResponse.RefreshToken,
                DeviceId = userMeToken?.DeviceId!
            });
        }
    }
}
