using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Statistical
{
    public class ParameterDocumentResponse
    {
        public long? TotalDocumentShare { get; set; }
        public long? TotalUserContribute { get; set; }
        public long? TotalCourseShare { get; set; }
    }
}
