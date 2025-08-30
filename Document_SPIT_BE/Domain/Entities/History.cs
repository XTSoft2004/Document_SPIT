using Domain.Common;
using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class History : EntityBase
    {
        // Nội dung lịch sử 
        [Required, StringLength(100)]
        public string Title { get; set; } = string.Empty;
        // Mô tả chi tiết về hành động đã thực hiện
        [Required, StringLength(250)]
        public string? Description { get; set; } = string.Empty;
        // Loại hành động đã thực hiện
        public Function_Enum? function_status { get; set; }

      
        public long? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual User? User { get; set; }
    }
}
