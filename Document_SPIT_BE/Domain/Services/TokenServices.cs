using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.TokenUser;
using Domain.Model.Response.Token;
using Domain.Model.Response.User;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Domain.Services
{
    public class TokenServices : BaseService, ITokenServices
    {
        private readonly IConfiguration _config;
        private readonly IRepositoryBase<User>? _user;
        private readonly IRepositoryBase<TokenUser>? _token;

        public TokenServices(IConfiguration config, IRepositoryBase<User>? user, IRepositoryBase<TokenUser>? token)
        {
            _config = config;
            _user = user;
            _token = token;
        }
        public TokenResponse GenerateToken(UserResponse user)
        {
            return new TokenResponse()
            {
                AccessToken = GenerateTokenUser(user),
                ExpiresAt = DateTime.Now.AddDays(Convert.ToInt32(_config["JwtSettings:ExpireToken"])),
                RefreshToken = GenerateRefreshToken(user),
                RefreshExpiresAt = DateTime.Now.AddDays(Convert.ToInt32(_config["JwtSettings:ExpireRefreshToken"]))
            };
        }
        public string GenerateTokenUser(UserResponse user)
        {
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]);
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _config["JwtSettings:Issuer"],
                Audience = _config["JwtSettings:Audience"],
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(Convert.ToInt32(_config["JwtSettings:ExpireToken"])),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken(UserResponse user)
        {
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]);
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _config["JwtSettings:Issuer"],
                Audience = _config["JwtSettings:Audience"],
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(Convert.ToInt32(_config["JwtSettings:ExpireRefreshToken"])),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
        public UserTokenResponse GetInfoFromToken(string token)
        {
            if (String.IsNullOrEmpty(token))
                return null;
            token = token.Replace("Bearer", "").Trim();
            var handler = new JwtSecurityTokenHandler();
            JwtSecurityToken jwtToken = null;
            try
            {
                jwtToken = handler.ReadJwtToken(token);
            }
            catch { return null; }

            var claims = jwtToken.Claims;
            var IdValue = claims.FirstOrDefault(c => c.Type == "nameid")?.Value;
            var username = claims.FirstOrDefault(c => c.Type == "unique_name")?.Value;
            var expiryDateUnix = claims.FirstOrDefault(c => c.Type == "exp")?.Value;
            var expiryDate = expiryDateUnix != null
                ? DateTimeOffset.FromUnixTimeSeconds(long.Parse(expiryDateUnix))
                    .ToOffset(TimeSpan.FromHours(7)) // Chuyển sang GMT+7
                    .DateTime
                : DateTime.MinValue;

            return new UserTokenResponse()
            {
                UserId = !string.IsNullOrEmpty(IdValue) ? long.Parse(IdValue) : -100,
                Username = username,
                ExpiryDate = expiryDate,
            };
        }

        public DateTime GetDateTimeFormToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var claim = jwtToken.Claims.FirstOrDefault(c => c.Type == "exp");
            return claim != null ? DateTimeOffset.FromUnixTimeSeconds(long.Parse(claim.Value))
                                                        .ToOffset(TimeSpan.FromHours(7)) // Chuyển sang GMT+7
                                                        .DateTime : DateTime.MinValue;
        }

        public string GetRefreshToken(long? userId)
        {
            var TokenUser = _token.Find(f => f.UserId == userId);
            if (TokenUser == null)
                return string.Empty;
            else
                return TokenUser?.Token;
        }
        public async Task<HttpResponse> UpdateRefreshToken(TokenRequest info)
        {
            var user = _user.Find(f => f.UserId == info.UserId);
            if(user == null)
                return HttpResponse.Error("Người dùng không tồn tại.", System.Net.HttpStatusCode.NotFound);

            var refreshToken = _token.Find(x => x.UserId == info.UserId);
            if (refreshToken != null)
            {
                refreshToken.Token = info.Token;
                refreshToken.ExpiryDate = info.ExpiryDate;
                _token.Update(refreshToken);
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK("Cập nhật token thành công.");
            }
            else
            {
                _token.Insert(new TokenUser()
                {
                    UserId = user.UserId,
                    User = user,
                    Token = info.Token,
                    ExpiryDate = info.ExpiryDate
                });
                await UnitOfWork.CommitAsync();
                return HttpResponse.OK("Thêm token thành công.");
            }
        }
    }
}
