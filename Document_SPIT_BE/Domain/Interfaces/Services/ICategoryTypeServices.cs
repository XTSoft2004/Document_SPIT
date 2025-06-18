using Domain.Common.Http;
using Domain.Model.Request.CategoryType;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface ICategoryTypeServices
    {
        Task<HttpResponse> CreateAsync(CategoryTypeRequest categoryTypeRequest);
        Task<HttpResponse> UpdateAsync(long IdCategoryType, CategoryTypeRequest categoryTypeRequest);
        Task<HttpResponse> DeleteAsync(long IdCategoryType);
    }
}
