using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Base.Services;
using Domain.Common;
using Domain.Entities.Base;

namespace Domain.Entities
{
    public class Document : EntityBase
    {
        [Required, StringLength(250)]
        public string? Name { get; set; }
        public long? TotalDownloads { get; set; } = 0;
        public long? TotalViews { get; set; } = 0;
        public string? PathFile { get; set; }
        public bool? IsPrivate { get; set; }
        public StatusDocument_Enum StatusDocument { get; set; } 

        public ICollection<DocumentCategory>? DocumentCategories { get; set; }

        public long? idTypeDocument { get; set; }
        [ForeignKey(nameof(idTypeDocument))]
        public virtual DocumentType? Type_Document { get; set; }

        public long? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual User? User { get; set; }
    }
}
