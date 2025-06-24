using Domain.Common;
using Domain.Common.GoogleDriver.Model.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Model.Request.Document
{
    public class DocumentRequest : UploadFileBase64Request
    {
        public string? Name { get; set; }
        public bool? IsPrivate { get; set; } = false;
        public string? StatusDocument { get; set; }
    }
}
