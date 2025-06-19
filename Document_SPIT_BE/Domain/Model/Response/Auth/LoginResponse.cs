using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Auth
{
    public class LoginResponse
    {
        public long? UserId { get; set; }
        public string? Username { get; set; } 
        public string? Fullname { get; set; }
        public bool? isLocked { get; set; }
        public string? AccessToken { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshExpiresAt { get; set; }
    }
}
