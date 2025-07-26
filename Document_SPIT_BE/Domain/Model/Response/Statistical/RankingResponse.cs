using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Statistical
{
    public class RankingResponse
    {
        public string? Username { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Fullname { get; set; }
        public long? TotalUpload { get; set; }
    }
}
