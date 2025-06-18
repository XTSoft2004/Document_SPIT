using Domain.Interfaces.Services;
using Domain.Model.Request.Document;
using Microsoft.AspNetCore.Mvc;
using static Domain.Common.AppConstants;

namespace Document_SPIT_BE.Controllers
{
    [Route("document")]
    [ApiController]
    public class DocumentController : Controller
    {
        private readonly IDocumentServices? _services;

        public DocumentController(IDocumentServices? services)
        {
            _services = services;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateAsync(DocumentRequest documentRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.CreateAsync(documentRequest);
            return response.ToActionResult();
        }
        [HttpPut("update/{IdDocument}")]
        public async Task<IActionResult> UpdateAsync(long IdDocument, DocumentRequest documentRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.UpdateAsync(IdDocument, documentRequest);
            return response.ToActionResult();
        }
        [HttpDelete("delete/{IdDocument}")]
        public async Task<IActionResult> DeleteAsync(long IdDocument)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.DeleteAsync(IdDocument);
            return response.ToActionResult();
        }
    }
}