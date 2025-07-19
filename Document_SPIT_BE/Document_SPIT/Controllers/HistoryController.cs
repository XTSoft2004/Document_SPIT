using Domain.Common.Http;
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

        [HttpGet]
        public async Task<IActionResult> GetHistory(string search = "", int pageNumber = -1, int pageSize = -1, bool isLogin = false, bool isActivity = false)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = _historyServices.GetHistory(search, pageNumber, pageSize, out int totalRecords, isLogin, isActivity);
            
            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

            return Ok(ResponseArray.ResponseList(response, totalRecords, totalPages, pageNumber, pageSize));
        }
    }
}
