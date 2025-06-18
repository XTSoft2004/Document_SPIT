using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class StarDocument : EntityBase
    {
        public long? UserId { get; set; }
        [ForeignKey("UserId")]  
        public virtual User? User { get; set; }
        public long? DocumentId { get; set; }
        [ForeignKey("DocumentId")]
        public virtual Document? Document { get; set; }
    }
}
