using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Statistical
{
    public class StarRequest
    {
        public long? UserId { get; set; }
        public long? DocumentId { get; set; }
    }
}
