using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Department : EntityBase
    {
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? FolderId { get; set; } 

        public ICollection<Course>? Courses { get; set; }
    }
}
