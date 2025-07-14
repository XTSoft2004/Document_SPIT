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
        [HttpGet("parameter-document")]
        public async Task<IActionResult> ParameterDocument()
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _statistical.ParameterDocument();
            return response.ToActionResult();
        }
        [HttpGet("line-chart-date")]
        public async Task<IActionResult> LineChartDate(int numberDay = 15)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);
            var response = await _statistical.LineChartDate(numberDay);
            return response.ToActionResult();
        }
    }
}
