using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Base.Services;
using Domain.Entities.Base;

namespace Domain.Entities
{
    public class TokenUser : EntityBase
    {
        public string? Token { get; set; }
        public DateTime? ExpiryDate { get; set; }

        public long? UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual User? User { get; set; }
    }
}
