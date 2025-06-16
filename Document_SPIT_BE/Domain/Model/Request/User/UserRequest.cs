using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.User
{
    public class UserRequest
    {
        public long? UserId { get; set; }
        public string? Username { get; set; }
        public string? FullName { get; set; }
        public bool IsLocked { get; set; } = false;
    }
}
