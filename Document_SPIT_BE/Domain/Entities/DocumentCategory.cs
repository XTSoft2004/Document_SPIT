using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities.Base;

namespace Domain.Entities
{
    public class DocumentCategory : EntityBase
    {
        public long DocumentId { get; set; }
        public Document? Document { get; set; }

        public long CategoryId { get; set; }
        public CategoryType? Type_Category { get; set; }
    }

}
