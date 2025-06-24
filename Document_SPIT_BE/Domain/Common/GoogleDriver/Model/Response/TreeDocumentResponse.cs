using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.GoogleDriver.Model.Response
{
    public class TreeDocumentResponse
    {
        public string? Name { get; set; }
        public string? FolderId { get; set; }
        public bool? IsFolder { get; set; }
        public List<TreeDocumentResponse> Children { get; set; } = new();
    }
}
