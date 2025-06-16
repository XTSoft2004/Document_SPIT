using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.TokenUser
{
    public class TokenRequest
    {
        public long? UserId { get; set; }
        public string? Token { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? DeviceId { get; set; }
    }
}
