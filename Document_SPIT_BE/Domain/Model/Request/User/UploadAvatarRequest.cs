using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.User
{
    public class UploadAvatarRequest
    {
        public string? imageBase64 { get; set; }
    }
}
