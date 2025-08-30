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
    public class Report : EntityBase
    {
        public long? UserId { get; set; }
        [ForeignKey("UserId")]
        public long? DocumentId { get; set; }
        [ForeignKey("DocumentId")]
        [StringLength(100), Required]
        public string? Title { get; set; }
        [StringLength(250), Required]
        public string? Description { get; set; }
        public ICollection<User>? Users { get; set; }
    }
}
