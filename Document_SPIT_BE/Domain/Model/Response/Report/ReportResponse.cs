using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Report
{
    public class ReportResponse
    {
        public long? UserId { get; set; }
        public long? DocumentId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
    }
}
