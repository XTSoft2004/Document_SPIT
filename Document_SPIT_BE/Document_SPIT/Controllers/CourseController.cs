using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Services;
using Domain.Model.Request.Course;
using Microsoft.AspNetCore.Mvc;
using static Domain.Common.AppConstants;

namespace Document_SPIT_BE.Controllers
{
    [Route("course")]
    [ApiController]
    public class CourseController : Controller
    {
        private readonly ICourseServices _services;

        public CourseController(ICourseServices services)
        {
            _services = services;
        }
        [HttpGet]
        public IActionResult GetCourse(string search = "", int pageNumber = -1, int pageSize = -1)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var courses = _services.GetCourse(search, pageNumber, pageSize, out int totalRecords);

            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);
            return Ok(ResponseArray.ResponseList(courses, totalRecords, totalPages, pageNumber, pageSize));
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CourseCreateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.CreateAsync(request);
            return response.ToActionResult();
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateAsync(long id, CourseRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.UpdateAsync(id, request);
            return response.ToActionResult();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(long id)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.DeleteAsync(id);
            return response.ToActionResult();
        }
    }
}
