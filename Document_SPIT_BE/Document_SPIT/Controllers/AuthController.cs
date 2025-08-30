using Domain.Interfaces.Services;
using Domain.Model.Request.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Domain.Common.AppConstants;

namespace Document_SPIT_BE.Controllers
{
    [Route("auth")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IAuthServices? _sevices;

        public AuthController(IAuthServices? sevices)
        {
            _sevices = sevices;
        }
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterRequest registerRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _sevices!.RegisterAsync(registerRequest);
            return response.ToActionResult();
        }
        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] LoginRequest loginRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _sevices!.LoginUser(loginRequest);
            return response.ToActionResult();
        }
        [HttpGet("logout")]
        public async Task<IActionResult> LogoutUser()
        {
            var response = await _sevices!.LogoutUser();
            return response.ToActionResult();
        }
        [Authorize]
        [HttpGet("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var response = await _sevices!.RefreshTokenAccount();
            return response.ToActionResult();
        }
        [Authorize]
        [HttpPost("password-security")]
        public async Task<IActionResult> PasswordSecurity([FromBody] PasswordSecurityRequest passwordSecurityRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);
            if(passwordSecurityRequest.PasswordSecurity == "SPIT_19082023")
                return Ok(new { message = "Xác minh mật khẩu bảo mật thành công" });
            else
                return BadRequest(new { message = "Mật khẩu bảo mật không chính xác" });
        }
    } 
}
