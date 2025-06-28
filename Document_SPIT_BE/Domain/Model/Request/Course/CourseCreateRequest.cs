using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Course
{
    public class CourseCreateRequest
    {
        public string? Code { get; set; }
        public string? Name { get; set; }
        public long? DepartmentId { get; set; }
    }
}
