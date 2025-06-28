using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Course : EntityBase
    {
        public string? Code { get; set; }

        public string? Name { get; set; }
        public string? FolderId { get; set; }

        public long? DepartmentId { get; set; }
        [ForeignKey(nameof(DepartmentId))]
        public virtual Department? Department { get; set; }

        public ICollection<Document>? Documents { get; set; }
    }
} 
