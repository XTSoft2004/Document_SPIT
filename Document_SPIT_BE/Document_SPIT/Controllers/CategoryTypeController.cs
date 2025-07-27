using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Services;
using Domain.Model.Request.CategoryType;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Domain.Common.AppConstants;

namespace Document_SPIT_BE.Controllers
{
    [Route("category-type")]
    [ApiController]
    public class CategoryTypeController : Controller
    {
        private readonly ICategoryTypeServices? _services;

        public CategoryTypeController(ICategoryTypeServices? categoryTypeServices)
        {
            _services = categoryTypeServices;
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateAsync(CategoryTypeRequest categoryTypeRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.CreateAsync(categoryTypeRequest);
            return response.ToActionResult();
        }
        [Authorize(Roles = "Admin")]
        [HttpPatch("{IdCategoryType}")]
        public async Task<IActionResult> UpdateAsync(long IdCategoryType, CategoryTypeRequest categoryTypeRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.UpdateAsync(IdCategoryType, categoryTypeRequest);
            return response.ToActionResult();
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{IdCategoryType}")]
        public async Task<IActionResult> DeleteAsync(long IdCategoryType)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.DeleteAsync(IdCategoryType);
            return response.ToActionResult();
        }
        [HttpGet]
        public IActionResult GetCategory(string search = "", int pageNumber = -1, int pageSize = -1)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var categories = _services.GetCategory(search, pageNumber, pageSize, out int totalRecords);

            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);
            return Ok(ResponseArray.ResponseList(categories, totalRecords, totalPages, pageNumber, pageSize));
        }
    }
}
