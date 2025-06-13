using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Base.Services;
using Domain.Entities.Base;

namespace Domain.Entities
{
    public class DocumentType : EntityBase
    {
        [Required, StringLength(100)]
        public string? Name { get; set; }
        public string? Description { get; set; }

        public ICollection<Document>? Documents { get; set; }
    }
}
