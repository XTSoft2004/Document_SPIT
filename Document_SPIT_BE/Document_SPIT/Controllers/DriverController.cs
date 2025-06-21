using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.GoogleDriver.Model.Request;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using static Domain.Common.AppConstants;

namespace Document_SPIT_BE.Controllers
{
    [Route("driver")]
    [ApiController]
    public class DriverController : Controller
    {
        private readonly IGoogleDriverServices? _services;
        private readonly IDocumentServices _documentServices;

        public DriverController(IGoogleDriverServices? services, IDocumentServices documentServices)
        {
            _services = services;
            _documentServices = documentServices;
        }
        [HttpGet("info")]
        public async Task<IActionResult> GetInfoDriver()
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);
            var response = await _services.GetInfoGoogleDriver();
            if (response == null)
                return NotFound(new { Message = "Không tìm thấy thông tin tài khoản Google Drive" });
            
            return Ok(response);
        }
        [HttpGet("thumbnail/{fileId}")]
        public async Task<IActionResult> GetThumbnailBase64(string fileId)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);
            var thumbnailBase64 = await _services.GetThumbnailBase64(fileId);
            if (string.IsNullOrEmpty(thumbnailBase64))
                return NotFound(new { Message = "Không tồn tại file, vui lòng kiểm tra lại" });

            thumbnailBase64 = thumbnailBase64.Replace("=s220", "=s550");
            // Convert base64 string to byte array
            byte[] imageBytes = Convert.FromBase64String(thumbnailBase64);
            // Set content type to image/png (or adjust if you know the actual type)
            return File(imageBytes, "image/png");
        }
        [HttpGet("preview/{fileId}")]
        public async Task<IActionResult> PreviewFile(string fileId)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var result = await _services.GetGoogleDrivePreviewAsync(fileId);
            if (result == null)
                return NotFound(new { Message = "Không tồn tại file, vui lòng kiểm tra lại" });
            _documentServices.ViewFile(fileId);

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
        public async Task<IActionResult> GetInfoFolder(string folderId, bool isOnlyFolder = false)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);

            var response = await _services.GetInfoFolder(folderId, isOnlyFolder);
            return Ok(response);
        }
    }
}
