using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Role : EntityBase
    {
        [StringLength(255), Required]
        public string DisplayName { get; set; } = string.Empty;
        public ICollection<User> Users { get; set; }
    }
}
