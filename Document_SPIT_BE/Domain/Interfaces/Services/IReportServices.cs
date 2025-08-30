using Domain.Common.Http;
using Domain.Model.Request.Report;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IReportServices
    {
        Task<HttpResponse> CreateAsync(ReportRequest reportRequest);
        Task<HttpResponse> UpdateAsync(long id, ReportRequest reportRequest);
        Task<HttpResponse> DeleteAsync(long id);
    }
}
