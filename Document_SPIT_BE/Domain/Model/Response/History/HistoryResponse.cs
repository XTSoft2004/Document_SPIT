using Domain.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Response.History
{
    public class HistoryResponse
    {
        public long? Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public string? FunctionStatus { get; set; }
        public long? UserId { get; set; }
        public string? Fullname { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
