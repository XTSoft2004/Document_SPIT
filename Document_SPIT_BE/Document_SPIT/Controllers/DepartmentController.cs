using Domain.Common.Http;
using Domain.Interfaces.Services;
using Domain.Model.Request.Department;
using Microsoft.AspNetCore.Mvc;
using static Domain.Common.AppConstants;

namespace Document_SPIT_BE.Controllers
{
    [Route("department")]
    [ApiController]
    public class DepartmentController : Controller
    {
        private readonly IDepartmentServices _sevices;

        public DepartmentController(IDepartmentServices sevices)
        {
            _sevices = sevices;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(DepartmentCreateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _sevices.CreateAsync(request);
            return Ok(response);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateAsync(long id, DepartmentUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);
            var response = await _sevices.UpdateAsync(id, request);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(long id)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _sevices.DeleteAsync(id);
            return Ok(response);
        }

        [HttpGet]
        public IActionResult GetDepartment(string search = "", int pageNumber = -1, int pageSize = -1)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var departments = _sevices.GetDepartment(search, pageNumber, pageSize, out int totalRecords);

            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);
            return Ok(ResponseArray.ResponseList(departments, totalRecords, totalPages, pageNumber, pageSize));
        }
    } 
}
