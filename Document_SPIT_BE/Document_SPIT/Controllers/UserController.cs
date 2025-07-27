using Domain.Common.Http;
using Domain.Interfaces.Services;
using Domain.Model.Request.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Domain.Common.AppConstants;

namespace Document_SPIT_BE.Controllers
{
    [Route("user")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserServices? _services;

        public UserController(IUserServices? sevices)
        {
            _services = sevices;
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("set-role")]
        public async Task<IActionResult> SetRole(string username, string roleName)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services!.SetRole(username, roleName);
            return response.ToActionResult();
        }
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services!.GetMe();
            return response.ToActionResult();
        }
        [HttpGet("history/{userId}")]
        public async Task<IActionResult> GetHistory(long userId)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services!.GetHistory(userId);
            return response.ToActionResult();
        }
        [HttpGet]
        public async Task<IActionResult> GetAllUsers(string search = "", int pageNumber = -1, int pageSize = -1)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var users = _services.GetUser(search, pageNumber, pageSize, out int totalRecords);

            if (users == null)
                return BadRequest(new { Message = "Danh sách người dùng trống !!!" });

            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

            return Ok(ResponseArray.ResponseList(users, totalRecords, totalPages, pageNumber, pageSize));
        }
        [Authorize(Roles = "Admin")]
        [HttpPatch("{Id}")]
        public async Task<IActionResult> UpdateAsync(long Id, UserRequest userRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            if (userRequest == null)
                return BadRequest(new { Message = "Thông tin người dùng không hợp lệ." });

            var response = await _services!.UpdateAsync(Id, userRequest);
            return response.ToActionResult();
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("ban-account/{userId}")]
        public async Task<IActionResult> BanAccount(long userId)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services!.BanAccount(userId);
            return response.ToActionResult();
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateAsync(UserCreateRequest userRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            if (userRequest == null)
                return BadRequest(new { Message = "Thông tin người dùng không hợp lệ." });

            var response = await _services!.CreateAsync(userRequest);
            return response.ToActionResult();
        }
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services!.GetProfileToken();
            return response.ToActionResult();
        }
        [HttpGet("stars")]
        public async Task<IActionResult> GetStars()
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services!.getStars();
            return response.ToActionResult();
        }
        [Authorize]
        [HttpPost("change-status-star/{documentId}")]
        public async Task<IActionResult> ChangeStatusStar(long documentId)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services!.ChangeStatusStar(documentId);
            return response.ToActionResult();
        }
        [HttpGet("recent-upload")]
        public async Task<IActionResult> GetRecentUpload()
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services!.GetRecentUpload();
            return response.ToActionResult();
        }
        [HttpGet("profile/{username}")]
        public async Task<IActionResult> GetProfileUser(string username)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services!.GetProfileUser(username);
            return response.ToActionResult();
        }
        [HttpPost("upload-avatar")]
        public async Task<IActionResult> UploadAvatar(UploadAvatarRequest uploadAvatarRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services!.UploadAvatar(uploadAvatarRequest);
            return response.ToActionResult();
        }
    }
}