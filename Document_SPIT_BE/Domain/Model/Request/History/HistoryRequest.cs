using Domain.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.History
{
    public class HistoryRequest
    {
        [Required, StringLength(100)]
        public string Title { get; set; } = string.Empty;
        [Required, StringLength(250)]
        public string? Description { get; set; } = string.Empty;
        public Function_Enum? function_status { get; set; }
        public long UserId  { get; set; }
    }
}
