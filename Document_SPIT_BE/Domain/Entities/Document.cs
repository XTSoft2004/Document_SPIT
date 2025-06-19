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
        public string Md5Checksum { get; set; } = string.Empty;
        public string? FileId { get; set; }
        public string? FolderId { get; set; }
        public StatusDocument_Enum? StatusDocument { get; set; }
        public bool? IsPrivate { get; set; } = false; // Mặc định là công khai
        public ICollection<DocumentCategory>? DocumentCategories { get; set; }
        public long? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual User? User { get; set; }

        // Thông tin về cảm xúc của người dùng về tài liệu
        public long? DetaiDocumentId { get; set; }
        [ForeignKey(nameof(DetaiDocumentId))]
        public virtual DetailDocument? DetaiDocument { get; set; }
        public ICollection<Report>? Reports { get; set; }
    }
}
