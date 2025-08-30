using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Document
{
    public class DocumentPendingRequest
    {
        public string? name { get; set; }
        public string? fileName { get; set; }
        public string? base64String { get; set; }
        public long? courseId { get; set; }
    }
}
