using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace Document_SPIT_BE.Controllers
{
    [Route("user")] 
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserServices? _sevices;

        public UserController(IUserServices? sevices)
        {
            _sevices = sevices;
        }

        [HttpPost("set-role/{roleName}")]
        public async Task<IActionResult> SetRole(long userId,string roleName)
        {
            var response = await _sevices!.SetRole(userId, roleName);
            return response.ToActionResult();
        }
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var response = await _sevices!.GetMe();
            return response.ToActionResult();
        }
    }
}
