using Domain.Base.Services;
using Domain.Common;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.History;
using Domain.Model.Request.User;
using Domain.Model.Response.Token;
using Domain.Model.Response.Statistical;
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
using System.Net.WebSockets;
using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.GoogleDriver.Model.Request;

namespace Domain.Services
{
    public class UserServices : BaseService, IUserServices
    {
        private readonly IRepositoryBase<User>? _user;
        private readonly IRepositoryBase<Role>? _role;
        private readonly IRepositoryBase<History>? _history;
        private readonly IRepositoryBase<StarDocument>? _startDocument;
        private readonly IRepositoryBase<Document>? _document;
        private readonly ITokenServices _tokenServices;
        private readonly IHistoryServices _historyServices;
        private readonly IGoogleDriverServices _googleDriverServices;
        private UserTokenResponse? userMeToken;
        public UserServices(IRepositoryBase<User>? user, IRepositoryBase<Role>? role, ITokenServices tokenServices, IRepositoryBase<History>? history, IRepositoryBase<StarDocument>? startDocument, IRepositoryBase<Document>? document, IHistoryServices historyServices, IGoogleDriverServices googleDriverServices)
        {
            _user = user;
            _role = role;
            _history = history;
            _tokenServices = tokenServices;
            _historyServices = historyServices;
            userMeToken = _tokenServices.GetTokenBrowser();
            _startDocument = startDocument;
            _document = document;
            _googleDriverServices = googleDriverServices;
            var envPath = Path.Combine(Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).Parent.Parent.Parent.Parent.FullName, ".env");
            DotNetEnv.Env.Load(envPath);
        }
        public async Task<HttpResponse> UpdateAsync(long idUser, UserRequest userRequest)
        {
            var user = _user!.Find(f => f.Id == idUser);
            if (user == null)
                return HttpResponse.Error(message: "Người dùng không tồn tại.", HttpStatusCode.NotFound);
            else if(userMeToken.RoleName != "Admin" && userMeToken.Id != idUser)
                return HttpResponse.Error(message: "Bạn không có quyền cập nhật thông tin người dùng này.", HttpStatusCode.Forbidden);

            user.Fullname = userRequest.Fullname ?? user.Fullname;
            user.Password = !string.IsNullOrEmpty(userRequest.Password) ? userRequest.Password : user.Password;
            user.ModifiedDate = DateTime.Now;

            await UnitOfWork.CommitAsync();
            
            await _historyServices.CreateAsync(new HistoryRequest 
            { 
                Title = "Cập nhật người dùng", 
                Description = $"Người dùng {user.Username} vừa được cập nhật.", 
                function_status = Function_Enum.Update_User, 
                UserId = userMeToken?.Id ?? -1 
            });
            
            return HttpResponse.OK(message: "Cập nhật người dùng thành công.");
        }
        public async Task<HttpResponse> GetMe()
        {
            if (userMeToken == null)
                return HttpResponse.Error(message: "Không tìm thấy thông tin người dùng.", HttpStatusCode.Unauthorized);

            var user = _tokenServices.GetInfoFromToken(_tokenServices.GetTokenFromHeader());

            return HttpResponse.OK(data: new UserResponse()
            {
                Id = user?.Id,
                Username = user?.Username,
                RoleName = user?.RoleName,
            });
        }
        public async Task<HttpResponse> SetRole(string? username, string roleName)
        {
            var user = _user!.Find(f => f.Username.Contains(username));
            if (user == null)
                return HttpResponse.OK(message: "Người dùng không tồn tại.");

            var role = _role!.Find(f => f.DisplayName == roleName);
            if (role != null)
            {
                user.RoleId = role.Id;
                user.Role = role;
                await UnitOfWork.CommitAsync();
                
                await _historyServices.CreateAsync(new HistoryRequest 
                { 
                    Title = "Cập nhật quyền", 
                    Description = $"Quyền của người dùng {user.Username} vừa được cập nhật thành {role.DisplayName}.", 
                    function_status = Function_Enum.Set_Role, 
                    UserId = userMeToken?.Id ?? -1 
                });
                
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
                RoleName = s.Role != null ? s.Role.DisplayName : null
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
            
            await _historyServices.CreateAsync(new HistoryRequest 
            { 
                Title = user.isLocked ? "Khóa tài khoản" : "Mở khóa tài khoản", 
                Description = $"Tài khoản {user.Username} vừa được {(user.isLocked ? "khóa" : "mở khóa")}.", 
                function_status = Function_Enum.Ban_User, 
                UserId = userMeToken?.Id ?? -1 
            });
            
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
            await UnitOfWork.CommitAsync();

            await _historyServices.CreateAsync(new HistoryRequest 
            { 
                Title = "Tạo người dùng", 
                Description = $"Người dùng {user.Username} vừa được tạo.", 
                function_status = Function_Enum.Create_User, 
                UserId = userMeToken?.Id ?? -1 
            });

            return HttpResponse.OK(message: "Tạo người dùng thành công.");
        }
        public async Task<HttpResponse> GetProfileToken()
        {
            var userResponse = _tokenServices.GetTokenBrowser();
            if(userResponse == null)
                return HttpResponse.Error(message: "Không tìm thấy thông tin người dùng từ token.", HttpStatusCode.Unauthorized);

            string refeshtoken = _tokenServices.GetRefreshToken(userResponse.Id);
            var tokenRF = _tokenServices.GetInfoFromToken(refeshtoken);

            var user = _user!.Find(f => f.Id == userResponse.Id);
            return HttpResponse.OK(message: "Lấy thông tin người dùng thành công.", data: new TokenInfoResponse()
            {
                UserId = userResponse.Id,
                AccessToken = _tokenServices.GetTokenFromHeader(),
                RefreshExpiresAt = tokenRF.ExpiryDate,
                RefreshToken = refeshtoken,
                ExpiresAt = userResponse.ExpiryDate,
                DeviceId = userResponse.DeviceId,
                IsLocked = user.isLocked,
                RoleName = _role!.Find(f => f.Id == user.RoleId)?.DisplayName ?? "",
            });
        }
        public async Task<HttpResponse> getStars()
        {
            // Lấy danh sách sao của người dùng
            var stars = _startDocument.All()
                .Where(s => s.UserId == userMeToken.Id)
                .Select(s => s.DocumentId)
                .ToArray();

            return HttpResponse.OK(
                message: "Lấy danh sách sao thành công.",
                data: stars
            );
        }
        public async Task<HttpResponse> ChangeStatusStar(long documentId)
        {
            // Kiểm tra xem người dùng đã đánh sao cho tài liệu này ha  y chưa
            var f = _startDocument.Find(f => f.UserId == userMeToken.Id && f.DocumentId == documentId);
            // Nếu đã đánh sao thì xóa sao
            if (f != null)
            {
                _startDocument.Delete(f);
                await UnitOfWork.CommitAsync(); 
            }
            // nếu chưa thì thêm sao
            else
            {
                var star = new StarDocument
                {
                    UserId = userMeToken.Id,
                    DocumentId = documentId
                };

                _startDocument.Insert(star);
                await UnitOfWork.CommitAsync();
            }

            await _historyServices.CreateAsync(new HistoryRequest 
            { 
                Title = "Cập nhật trạng thái sao", 
                Description = f != null ? "Đã bỏ sao tài liệu." : "Đã đánh sao tài liệu.", 
                function_status = Function_Enum.Update_Status_Star, 
                UserId = userMeToken?.Id ?? -1 
            });

            return HttpResponse.OK(message: "Cập nhật trạng thái sao thành công.");
        }

        public async Task<HttpResponse> GetRecentUpload()
        {
            // Lấy danh sách 10 tài liệu đã tải lên gần đây của người dùng
            var recentUploads = _document.All()
                .Where(d => d.UserId == userMeToken.Id)
                .OrderByDescending(d => d.ModifiedDate)
                .Take(10)
                .Select(d => new RecentUploadResponse
                {
                    Id = d.Id,
                    Name = d.Name,
                    ModifiedDate = d.ModifiedDate
                })
                .ToList();

            return HttpResponse.OK(
                data: recentUploads,
                message: "Lấy danh sách tài liệu đã tải lên gần đây thành công."
            );
        }
        public async Task<HttpResponse> GetProfileUser(string username)
        {
            var user = _user!.Find(f => f.Username == username);
            if (user == null)
                return HttpResponse.Error(message: "Người dùng không tồn tại.", HttpStatusCode.NotFound);

            var data = new ProfileResponse
            {
                UserId = user.Id,
                Username = user.Username,
                Fullname = user.Fullname,
                Email = user.Email,
                RoleName = _role.Find(r => r.Id == user.RoleId)?.DisplayName,
                AvatarUrl = user.AvatarUrl,
            };

            return HttpResponse.OK(
                data: data,
                message: "Lấy thông tin người dùng thành công."
            );
        }
        public async Task<HttpResponse> UploadAvatar(UploadAvatarRequest uploadAvatarRequest)
        {
            if (userMeToken == null)
                return HttpResponse.Error(message: "Không tìm thấy thông tin người dùng.", HttpStatusCode.Unauthorized);
           
            if (uploadAvatarRequest == null || string.IsNullOrEmpty(uploadAvatarRequest.imageBase64))
                return HttpResponse.Error(message: "Thông tin hình ảnh không hợp lệ.", HttpStatusCode.BadRequest);

            var user = _user!.Find(f => f.Id == userMeToken.Id);
            if (user == null)
                return HttpResponse.Error(message: "Người dùng không tồn tại.", HttpStatusCode.NotFound);

            string base64Check = uploadAvatarRequest.imageBase64.Split(',').Length == 2 ? uploadAvatarRequest.imageBase64.Split(',')[1] : string.Empty;
            if (string.IsNullOrEmpty(base64Check))
                return HttpResponse.Error("Base64 không hợp lệ, vui lòng kiểm tra lại.", System.Net.HttpStatusCode.BadRequest);

            string FOLDER_AVATAR = Environment.GetEnvironmentVariable("FOLDER_AVATAR");
            var infoUpload = await _googleDriverServices.UploadFile(new UploadFileBase64Request
            {
                Base64String = base64Check,
                FileName = $"{user.Username}_avatar.png",
                FolderId = FOLDER_AVATAR
            });
            
            if(infoUpload != null)
            {
                user.AvatarUrl = $"https://drive.google.com/thumbnail?id={infoUpload.id}&sz=w500";
                _user.Update(user);
            }

            await UnitOfWork.CommitAsync();
            await _historyServices.CreateAsync(new HistoryRequest 
            { 
                Title = "Cập nhật ảnh đại diện", 
                Description = $"Người dùng {user.Username} vừa cập nhật ảnh đại diện.", 
                function_status = Function_Enum.Update_Avatar, 
                UserId = userMeToken?.Id ?? -1 
            });
            return HttpResponse.OK(message: "Cập nhật ảnh đại diện thành công.");
        }
    } 
}