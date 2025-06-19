using Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.User
{
    public class UserHistoryResponse
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public Function_Enum? function_status { get; set; }

        public long? UserId { get; set; }
    }
}
