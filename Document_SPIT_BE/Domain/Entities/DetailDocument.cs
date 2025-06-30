using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class DetailDocument : EntityBase
    {
        // Tổng số lượt tải xuống
        public long? TotalDownload { get; set; }
        // Tổng số lượt xem
        public long? TotalView { get; set; }

        // ID của tài liệu liên kết
        public long? DocumentId { get; set; }
        [ForeignKey(nameof(DocumentId))]
        public virtual Document? Document { get; set; } 
    }
}
