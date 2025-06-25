using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Course
{
    public class CourseResponse
    {
        public long? Id { get; set; }
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? FolderId_Contribute { get; set; }
        public string? FolderId_Base { get; set; }
        public long? DepartmentId { get; set; }
    }
}
