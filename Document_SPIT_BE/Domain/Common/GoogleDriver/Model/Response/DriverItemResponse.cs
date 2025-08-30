using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.Common.GoogleDriver.Model.Response
{
    public class DriverItemResponse
    {
        public string Id { get; set; }
        public string Name { get; set; }
        [JsonIgnore]
        public string? WebContentLink { get; set; } // null nếu là folder
        [JsonIgnore]
        public string WebViewLink { get; set; }
        public string CreatedTime { get; set; }
        //[JsonIgnore]
        public string? Md5Checksum { get; set; } // null nếu là folder
        public bool IsFolder => (!string.IsNullOrEmpty(WebViewLink) && WebViewLink.Contains("/folders/")); // phân biệt file và thư mục
        public string? parentId { get; set; }
        public string TypeDocument
        {
            get
            {
                if (IsFolder) return "Folder";

                var extension = Path.GetExtension(Name);
                return string.IsNullOrEmpty(extension) ? "Unknown" : extension.TrimStart('.').ToLower();
            }
        }
    }
}
