using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Report
{
    public class ReportRequest
    {
        public long? UserId { get; set; }
        public long? DocumentId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
    }
}
