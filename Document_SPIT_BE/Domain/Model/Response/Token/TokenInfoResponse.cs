using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Token
{
    public class TokenInfoResponse
    {
        public long? UserId { get; set; }
        public string? AccessToken { get; set; }
        public DateTime ExpiresAt { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshExpiresAt { get; set; }
        public string DeviceId { get; set; } = string.Empty;
        public bool IsLocked { get; set; } = false;
        public string RoleName { get; set; } = string.Empty;
    }
}
