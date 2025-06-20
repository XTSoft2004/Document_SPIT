using Domain.Common.GoogleDriver.Interfaces;
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
        private readonly IGoogleDriverServices? _googleDriverServices;
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
        [HttpPut("{IdDocument}")]
        public async Task<IActionResult> UpdateAsync(long IdDocument, DocumentRequest documentRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.UpdateAsync(IdDocument, documentRequest);
            return response.ToActionResult();
        }
        [HttpDelete("{IdDocument}")]
        public async Task<IActionResult> DeleteAsync(long IdDocument)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.DeleteAsync(IdDocument);
            return response.ToActionResult();
        }
        [HttpGet("download/{fileId}")]
        public async Task<IActionResult> DownloadFile(string fileId)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var (data, contentType, fileName) = await _services.DownloadFile(fileId);
            if(data == null || contentType == null || fileName == null)
                return NotFound(new { Message = "Không tồn tại file, vui lòng kiểm tra lại" });

            Response.Headers["Content-Disposition"] = $"attachment; filename=\"{fileName}\"";
            return new FileContentResult(data, contentType);
        }
        [HttpGet("documents")]
        public async Task<IActionResult> GetDocuments()
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.GetDocuments();

            return response.ToActionResult();
        }
    }
}