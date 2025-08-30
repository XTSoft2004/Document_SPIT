using Domain.Interfaces.Services;
using Domain.Model.Request.Report;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using static Domain.Common.AppConstants;

namespace Document_SPIT_BE.Controllers
{
    [Route("report")]
    [ApiController]
    public class ReportController: Controller
    {
        public readonly IReportServices? _reportServices;
        [HttpGet]
        public async Task<IActionResult> CreateAsync(ReportRequest reportRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var repsonse = await _reportServices.CreateAsync(reportRequest);
            return repsonse.ToActionResult();
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(long id, ReportRequest reportRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _reportServices.UpdateAsync(id, reportRequest);
            return response.ToActionResult();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(long id)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _reportServices.DeleteAsync(id);
            return response.ToActionResult();
        }
    }
}
