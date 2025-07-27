using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.Gemini.Models
{
    public class UploadFileGeminiCheckRequest
    {
        public string? mineType { get; set; }
        public string? base64File { get; set; }
    }
}
