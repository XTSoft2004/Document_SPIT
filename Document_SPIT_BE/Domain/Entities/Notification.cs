using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Base.Services;
using Domain.Entities.Base;

namespace Domain.Entities
{
    public class Notification : EntityBase
    {
        [Required, StringLength(100)]
        public string? Message { get; set; }
        [Required, StringLength(250)]
        public string? Description { get; set; }
        public bool? IsRead { get; set; }

        public long? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public virtual User? User { get; set; }
    }
}
