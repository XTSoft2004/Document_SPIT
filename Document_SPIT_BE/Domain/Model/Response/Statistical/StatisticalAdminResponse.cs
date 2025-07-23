using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Statistical
{
    public class StatisticalAdminResponse
    {
        public long? TotalDocuments { get; set; }
        public long? TotalUsers { get; set; }
        public long? TotalCourses { get; set; }
        public long? TotalDocumentToday { get; set; }
        public double? PercentDocuments { get; set; }
        public double? PercentUsers { get; set; }
        public double? PercentCourses { get; set; }
        public double? PercentDocumentToday { get; set; }
    }
}
