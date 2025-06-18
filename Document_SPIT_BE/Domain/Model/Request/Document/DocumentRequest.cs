using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Document
{
    public class DocumentRequest
    {
        public string? Name { get; set; }
        public long? TotalDownloads { get; set; } = 0;
        public long? TotalViews { get; set; } = 0;
        public string? FileId { get; set; }
        public bool? IsPrivate { get; set; }
        public string? StatusDocument { get; set; }
        public long? UserId { get; set; }
        public string? FolderId { get; set; }
    }
}
