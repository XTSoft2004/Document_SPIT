using Domain.Interfaces.Services;
using Domain.Model.Request.Report;
using Domain.Services;
using Microsoft.AspNetCore.Mvc;
using static Domain.Common.AppConstants;

namespace Document_SPIT_BE.Controllers
{
    [Route("history")]
    [ApiController]
    public class HistoryController : Controller
    {
        private readonly IHistoryServices _historyServices;

        public HistoryController(IHistoryServices? historyServices)
        {
            _historyServices = historyServices;
        }

        [HttpGet("{sizePage}")]
        public async Task<IActionResult> GetHistory(int sizePage = 10)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var repsonse = await _historyServices.GetHistory(sizePage);
            return repsonse.ToActionResult();
        }
    }
}
