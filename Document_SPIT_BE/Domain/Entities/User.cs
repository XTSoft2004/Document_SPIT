using Domain.Base.Services;
using Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class User : EntityBase
    {
        [Required, StringLength(100)]
        public string? Username { get; set; }
        [Required, StringLength(250)]
        public string? Password { get; set; }
        public string? Fullname { get; set; }    
        public bool isLocked { get; set; }


        /// Role information
        public long? RoleId { get; set; }
        [ForeignKey(nameof(RoleId))]
        public virtual Role? Role { get; set; }

        public ICollection<TokenUser>? Tokens { get; set; }
        public ICollection<Document>? Documents { get; set; }
        public ICollection<Notification>? Notifications { get; set; }
        public ICollection<History>? Historys { get; set; }
    }
}
