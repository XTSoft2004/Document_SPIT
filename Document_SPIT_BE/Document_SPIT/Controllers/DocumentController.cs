using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.Http;
using Domain.Interfaces.Services;
using Domain.Model.Request.Document;
using Domain.Services;
using Infrastructure.Migrations;
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
        public async Task<IActionResult> CreateAsync(DocumentCreateRequest documentRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.CreateAsync(documentRequest);
            return response.ToActionResult();
        }
        [HttpPatch("{IdDocument}")]
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
            if (data == null || contentType == null || fileName == null)
                return NotFound(new { Message = "Không tồn tại file, vui lòng kiểm tra lại" });

            Response.Headers["Content-Disposition"] = $"attachment; filename=\"{fileName}\"";
            return new FileContentResult(data, contentType);
        }
        [HttpGet]
        public async Task<IActionResult> GetDocuments(string search = "", int pageNumber = -1, int pageSize = -1)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var documents = _services.GetDocuments(search, pageNumber, pageSize, out int totalRecords);

            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);
            return Ok(ResponseArray.ResponseList(documents, totalRecords, totalPages, pageNumber, pageSize));
        }
        [HttpGet("preview/{IdDocument}")]
        public async Task<IActionResult> GetPreviewByDocumetId(long IdDocument)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);
            var result = await _services.GetPreviewByDocumetId(IdDocument);
            if (result == null)
                return NotFound(new { Message = "Không tồn tại file, vui lòng kiểm tra lại" });

            var (data, contentType, fileName) = result.Value;

            Response.Headers["Content-Disposition"] = $"inline; filename=\"{fileName}\"";
            return new FileContentResult(data, contentType);
        }
        [HttpGet("{documentId}")]
        public async Task<IActionResult> GetLinkViewId(long documentId)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);
            var document = await _services.GetLinkView(documentId);
          
            return document.ToActionResult();
        }
        [HttpGet("view/{code}")]
        public async Task<IActionResult> ViewDocumentByCode(string code)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);
            var result = await _services.ViewOnce(code);
            if (result == null)
                return NotFound(new { Message = "Không tồn tại file, vui lòng kiểm tra lại" });

            var (data, contentType, fileName) = result.Value;

            Response.Headers["Content-Disposition"] = $"inline; filename=\"{fileName}\"";
            return new FileContentResult(data, contentType);
        }
    }
}