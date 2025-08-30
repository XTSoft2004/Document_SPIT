using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.Statistical
{
    public class RecentUploadResponse
    {
        public long? Id { get; set; }
        public string? Name { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
