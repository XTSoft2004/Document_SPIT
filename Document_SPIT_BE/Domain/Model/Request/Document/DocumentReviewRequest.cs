using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Document
{
    public class DocumentReviewRequest
    {
        public string? name { get; set; }
        public long? courseId { get; set; }
        public string? folderId { get; set; }
       public string? statusDocument { get; set; } = "Pending";
    }
}
