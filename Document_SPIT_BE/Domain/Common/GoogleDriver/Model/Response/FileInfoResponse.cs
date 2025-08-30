using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.GoogleDriver.Model.Response
{
    public class FileInfoResponse
    {
        public string? id { get; set; }
        public string? name { get; set; }
        public string? mimeType { get; set; }
        public string? webContentLink { get; set; }
        public string? webViewLink { get; set; }
        public string? thumbnailLink { get; set; }
    }
}
