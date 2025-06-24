using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Document
{
    public class DocumentResponse
    {
        public long? Id { get; set; }
        public string? Name { get; set; }
        public long? TotalDownloads { get; set; } = 0;
        public long? TotalViews { get; set; } = 0;
        public string? FileId { get; set; }
        public bool? IsPrivate { get; set; }
        public string? StatusDocument { get; set; }
        public long? UserId { get; set; }
        public string? FolderId { get; set; }
        public string? FileName { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
