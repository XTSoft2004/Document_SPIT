using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.User
{
    public class UserCreateRequest
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Fullname { get; set; }
    }
}
