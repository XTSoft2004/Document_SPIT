using Domain.Base.Services;
using Domain.Common;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.History;
using Domain.Model.Request.Report;
using Domain.Model.Response.Report;
using Domain.Model.Response.Token;
using Domain.Model.Response.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class ReportServices : BaseService, IReportServices
    {
        public readonly IRepositoryBase<Report> _report;
        public readonly IRepositoryBase<User> _user;
        public readonly IRepositoryBase<Document> _document;
        private readonly IHistoryServices _historyServices;
        private readonly ITokenServices _tokenServices;
        private UserTokenResponse? userMeToken;

        public ReportServices(IRepositoryBase<Report> report, IRepositoryBase<User> user, IRepositoryBase<Document> document, IHistoryServices historyServices, ITokenServices tokenServices)
        {
            _report = report;
            _user = user;
            _document = document;
            _historyServices = historyServices;
            _tokenServices = tokenServices;
            userMeToken = _tokenServices.GetTokenBrowser();
        }
        public async Task<HttpResponse> CreateAsync(ReportRequest reportRequest)
        {
            var user = _user.Find(u => u.Id == reportRequest.UserId);
            if (user == null)
                return HttpResponse.Error(message: "Người dùng không tồn tại.", System.Net.HttpStatusCode.NotFound);
            var document = _document.Find(d => d.Id == reportRequest.DocumentId);
            if (document == null)
                return HttpResponse.Error(message: "Tài liệu không tồn tại.", System.Net.HttpStatusCode.NotFound);

            var report = new Report
            {
                UserId = reportRequest.UserId,
                DocumentId = reportRequest.DocumentId,
                Title = reportRequest.Title,
                Description = reportRequest.Description,

                CreatedDate = DateTime.Now,
                CreatedBy = userMeToken.Username,
            };

            _report.Insert(report);
            await UnitOfWork.CommitAsync();
            
            await _historyServices.CreateAsync(new HistoryRequest 
            { 
                Title = "Tạo báo cáo", 
                Description = $"Báo cáo {report.Title} vừa được tạo.", 
                function_status = Function_Enum.Create_Report, 
                UserId = userMeToken?.Id ?? -1 
            });
            
            return HttpResponse.OK(message: "Báo cáo đã được tạo thành công.");
        }
        public async Task<HttpResponse> UpdateAsync(long id, ReportRequest reportRequest)
        {
            var user = _user.Find(u => u.Id == reportRequest.UserId);
            if (user == null)
                return HttpResponse.Error(message: "Người dùng không tồn tại.", System.Net.HttpStatusCode.NotFound);
            var document = _document.Find(d => d.Id == reportRequest.DocumentId);
            if (document == null)
                return HttpResponse.Error(message: "Tài liệu không tồn tại.", System.Net.HttpStatusCode.NotFound);

            var report = _report.Find(r => r.Id == id);
            if (report == null)
                return HttpResponse.Error(message: "Báo cáo không tồn tại.", System.Net.HttpStatusCode.NotFound);

            report.Title = reportRequest.Title;
            report.Description = reportRequest.Description;

            report.ModifiedDate = DateTime.Now;
            report.ModifiedBy = userMeToken.Username;
            _report.Update(report);
            await UnitOfWork.CommitAsync();

            await _historyServices.CreateAsync(new HistoryRequest 
            { 
                Title = "Cập nhật báo cáo", 
                Description = $"Báo cáo {report.Title} vừa được cập nhật.", 
                function_status = Function_Enum.Update_Report, 
                UserId = userMeToken?.Id ?? -1 
            });

            return HttpResponse.OK(message: "Báo cáo đã được cập nhật thành công.");
        }
        public async Task<HttpResponse> DeleteAsync(long id)
        {
            var report = _report.Find(r => r.Id == id);

            if (report == null)
                return HttpResponse.Error(message: "Báo cáo không tồn tại.", System.Net.HttpStatusCode.NotFound);

            _report.Delete(report);
            await UnitOfWork.CommitAsync();

            await _historyServices.CreateAsync(new HistoryRequest 
            { 
                Title = "Xóa báo cáo", 
                Description = $"Báo cáo {report.Title} vừa được xóa.", 
                function_status = Function_Enum.Delete_Report, 
                UserId = userMeToken?.Id ?? -1 
            });

            return HttpResponse.OK(message: "Báo cáo đã được xóa thành công.");
        }
    }
}
