using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Department
{
    public class DepartmentUpdateRequest
    {
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? FolderId { get; set; }
    }
}
