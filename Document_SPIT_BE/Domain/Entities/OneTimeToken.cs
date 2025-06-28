using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class OneTimeToken : EntityBase
    {
        public string Code { get; set; }
        public string FileId { get; set; }
        public long UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
