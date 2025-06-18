using Domain.Interfaces.Services;
using Domain.Model.Request.Auth;
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
    } 
}
