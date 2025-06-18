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
        public long? TotalDownloads { get; set; } = 0;
        public long? TotalViews { get; set; } = 0;
        public bool? IsPrivate { get; set; }
        public string? StatusDocument { get; set; }
        public long? UserId { get; set; }
    }
}
