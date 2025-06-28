using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using static Domain.Common.AppConstants;

namespace Document_SPIT_BE.Controllers
{
    [Route("statistical")]
    [ApiController]
    public class StatisticalController : Controller
    {
        public readonly IStatisticalServices? _statistical;
        public StatisticalController(IStatisticalServices statistical)
        {
            _statistical = statistical ?? throw new ArgumentNullException(nameof(statistical));
        }

        [HttpGet("ranking")]
        public async Task<IActionResult> GetRanking()
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _statistical.GetRanking();
            return response.ToActionResult();
        }
    }
}
