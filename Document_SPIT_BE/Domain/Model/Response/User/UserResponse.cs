﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.User
{
    public class UserResponse
    {
        public long? Id { get; set; }
        public string? Username { get; set; }
        public string? Fullname { get; set; }
    }
}
