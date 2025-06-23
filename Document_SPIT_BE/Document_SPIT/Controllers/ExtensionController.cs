using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using static Domain.Common.AppConstants;

namespace Document_SPIT_BE.Controllers
{
    public class ExtensionController : Controller
    {
        private readonly IExtensionServices? _services;

        public ExtensionController(IExtensionServices? services)
        {
            _services = services;
        }
        [HttpGet("load-folder/{folderId}")]
        public async Task<IActionResult> LoadFolderDriver(string folderId)
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);
            await _services!.LoadFolderDriver(folderId);
            return Ok(new { Message = "Các thư mục đã được load thành công" });
        }
        [HttpGet("load-modifiedDate")]
        public async Task<IActionResult> LoadModifiedDate()
        {
            if (!ModelState.IsValid)
                return BadRequest(DefaultString.INVALID_MODEL);
            await _services!.LoadModifiedDate();
            return Ok(new { Message = "Các tài liệu đã được cập nhật ngày sửa đổi thành công" });
        }   
    }
}
