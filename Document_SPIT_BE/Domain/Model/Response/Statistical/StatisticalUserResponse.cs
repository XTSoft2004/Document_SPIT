using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Statistical
{
    public class StatisticalUserResponse
    {
        public long? TotalDocuments { get; set; }
        public long? TotalViews { get; set; }
        public long? TotalDownloads { get; set; }
        public long? TotalStars { get; set; }
    }
}
