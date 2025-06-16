using Domain.Base.Services;
using Domain.Entities.Base;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class User : EntityBase
    {
        [Required]
        public long? UserId { get; set; }
        [Required, StringLength(100)]
        public string? Username { get; set; }
        [Required, StringLength(250)]
        public string? FullName { get; set; }
        
        public bool isLocked { get; set; }
        public ICollection<TokenUser>? Tokens { get; set; }
        public ICollection<Document>? Documents { get; set; }
    }
}
