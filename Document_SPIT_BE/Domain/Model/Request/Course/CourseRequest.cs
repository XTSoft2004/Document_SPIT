using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Course
{
    public class CourseRequest
    {
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? FolderId { get; set; }
        public long? DepartmentId { get; set; }
    }
}
