using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.User
{
    public class ProfileResponse
    {
        public long UserId { get; set; }
        public string Username { get; set; }
        public string Fullname { get; set; }
        public string Email { get; set; }
        public string RoleName { get; set; }
        public string AvatarUrl { get; set; }
    }
}
