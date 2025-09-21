using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.GoogleDriver.Model.Response
{
    public class DriveFileItem
    {
        public string Id { get; set; }
        public long? DocumentId { get; set; }
        public long? TotalDownloads { get; set; } = 0;
        public long? TotalViews { get; set; } = 0;
        public string Name { get; set; } = string.Empty;
        public string MimeType { get; set; } = string.Empty;
        public string CourseCode { get; set; } = string.Empty;
        public List<string>? Parents { get; set; }
    }
}
