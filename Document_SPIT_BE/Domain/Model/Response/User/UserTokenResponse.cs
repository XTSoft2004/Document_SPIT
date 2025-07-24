using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Intrinsics.X86;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.User
{
    public class UserTokenResponse
    {
        public long? Id { get; set; }
        public string? Username { get; set; }
        public string? Fullname { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string? DeviceId { get; set; }
        public string? RoleName { get; set; }
    }
}
