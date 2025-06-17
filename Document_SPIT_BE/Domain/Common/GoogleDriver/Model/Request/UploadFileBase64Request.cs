using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.GoogleDriver.Model.Request
{
    public class UploadFileBase64Request
    {
        public string? Base64String { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FolderId { get; set; } = string.Empty;
    }
}
