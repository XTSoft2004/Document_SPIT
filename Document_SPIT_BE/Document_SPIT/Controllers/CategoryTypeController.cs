using Domain.Interfaces.Services;
using Domain.Model.Request.CategoryType;
using Microsoft.AspNetCore.Mvc;

namespace Document_SPIT_BE.Controllers
{
    [Route("category-type")]
    [ApiController]
    public class CategoryTypeController : Controller
    {
        private readonly ICategoryTypeServices? _categoryTypeServices;

        public CategoryTypeController(ICategoryTypeServices? categoryTypeServices)
        {
            _categoryTypeServices = categoryTypeServices;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateAsync(CategoryTypeRequest categoryTypeRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid model.");
            var response = await _categoryTypeServices.CreateAsync(categoryTypeRequest);
            return response.ToActionResult();
        }
        [HttpPut("update/{IdCategoryType}")]
        public async Task<IActionResult> UpdateAsync(long IdCategoryType, CategoryTypeRequest categoryTypeRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid model.");
            var response = await _categoryTypeServices.UpdateAsync(IdCategoryType, categoryTypeRequest);
            return response.ToActionResult();
        }
        [HttpDelete("delete/{IdCategoryType}")]
        public async Task<IActionResult> DeleteAsync(long IdCategoryType)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid model.");
            var response = await _categoryTypeServices.DeleteAsync(IdCategoryType);
            return response.ToActionResult();
        }
    }
}
