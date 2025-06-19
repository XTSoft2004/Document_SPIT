using Domain.Interfaces.Services;
using Domain.Model.Request.Statistical;
using Microsoft.AspNetCore.Mvc;
using static Domain.Common.AppConstants;

namespace Document_SPIT_BE.Controllers
{
    [Route("statistical")]
    [ApiController]
    public class StatisticalController : Controller
    {
        public readonly IStatisticalServices? _statistical;

        [HttpGet("ranking")]
        public async Task<IActionResult> GetRanking()
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _statistical.GetRanking();
            return response.ToActionResult();
        }
        [HttpPost("star")]
        public async Task<IActionResult> ChangeStatusStar(StarRequest starRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _statistical.ChangeStatusStar(starRequest);
            return response.ToActionResult();
        }
        [HttpGet("recent-upload/{id}")]
        public async Task<IActionResult> GetRecentUpload(long id)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _statistical.GetRecentUpload(id);
            return response.ToActionResult();
        }
    }
}
