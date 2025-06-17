using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.GoogleDriver.Model.Request;
using Microsoft.AspNetCore.Mvc;
using static Domain.Common.AppConstants;

namespace Document_SPIT_BE.Controllers
{
    [Route("driver")]
    [ApiController]
    public class DriverController : Controller
    {
        private readonly IGoogleDriverServices? _services;

        public DriverController(IGoogleDriverServices? services)
        {
            _services = services;
        }
        [HttpGet("preview/{fileId}")]
        public async Task<IActionResult> PreviewFile(string fileId)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var result = await _services.GetGoogleDrivePreviewAsync(fileId);
            if (result == null)
                return NotFound(new { Message = "Không tồn tại file, vui lòng kiểm tra lại" });

            var (data, contentType, fileName) = result.Value;

            Response.Headers["Content-Disposition"] = $"inline; filename=\"{fileName}\"";
            return new FileContentResult(data, contentType);
        }
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(UploadFileBase64Request uploadFileRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            if (string.IsNullOrEmpty(uploadFileRequest.Base64String))
                return BadRequest(new { Message = "File không hợp lệ !!!" });

            var response = await _services.UploadFile(uploadFileRequest);
            if (response == null)
                return BadRequest(new { Message = "Lỗi khi upload file !!!" });

            return Ok(response);
        }
        [HttpGet("find/{folderId}")]
        public async Task<IActionResult> GetInfoFolder(string folderId)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.GetInfoFolder(folderId);
            return Ok(response);
        }
    }
}
