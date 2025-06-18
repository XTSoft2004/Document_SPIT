using Domain.Interfaces.Services;
using Domain.Model.Request.CategoryType;
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

        [HttpPost("create")]
        public async Task<IActionResult> CreateAsync(CategoryTypeRequest categoryTypeRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.CreateAsync(categoryTypeRequest);
            return response.ToActionResult();
        }
        [HttpPut("{IdCategoryType}")]
        public async Task<IActionResult> UpdateAsync(long IdCategoryType, CategoryTypeRequest categoryTypeRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.UpdateAsync(IdCategoryType, categoryTypeRequest);
            return response.ToActionResult();
        }
        [HttpDelete("{IdCategoryType}")]
        public async Task<IActionResult> DeleteAsync(long IdCategoryType)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.DeleteAsync(IdCategoryType);
            return response.ToActionResult();
        }
    }
}
