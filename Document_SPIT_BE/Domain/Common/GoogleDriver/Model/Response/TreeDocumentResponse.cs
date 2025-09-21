using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.GoogleDriver.Model.Response
{
    public class TreeDocumentResponse
    {
        public long? DocumentId { get; set; }
        public string? Name { get; set; }
        public long? TotalDownloads { get; set; } = 0;
        public long? TotalViews { get; set; } = 0;
        public string? FolderId { get; set; }
        public bool? IsFolder { get; set; }
        public string? CourseCode { get; set; }
        public List<TreeDocumentResponse> Children { get; set; } = new();
    }
}
