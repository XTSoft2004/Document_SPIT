using Domain.Base.Services;
using Domain.Common;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.History;
using Domain.Model.Response.History;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class HistoryServices : BaseService, IHistoryServices
    {
        private readonly IRepositoryBase<History>? _history;
        private readonly IRepositoryBase<User>? _user;
        public HistoryServices(IRepositoryBase<History>? history, IRepositoryBase<User>? user)
        {
            _history = history;
            _user = user;
        }

        public async Task<HttpResponse> CreateAsync(HistoryRequest historyRequest)
        {
            if (string.IsNullOrEmpty(historyRequest.Title) || string.IsNullOrEmpty(historyRequest.Description))
                return HttpResponse.Error(message: "Chưa nhập đầy đủ thông tin");

            var user = _user.Find(f => f.Id == historyRequest.UserId);
            if (user == null)
                return HttpResponse.Error(message: "Thành viên này không tồn tại, vui lòng kiểm tra lại!");

            var history = new History()
            {
                Title = historyRequest.Title,
                Description = historyRequest.Description,
                function_status = historyRequest.function_status,
                UserId = historyRequest.UserId,
                CreatedDate = DateTime.Now,
                ModifiedDate = DateTime.Now,
            };

            _history.Insert(history);
            await UnitOfWork.CommitAsync();

            return HttpResponse.OK(message: "Tạo lịch sử thành công!");
        }

        public async Task<HttpResponse> UpdateAsync(long historyId, HistoryRequest historyRequest)
        {
            var user = _user.Find(f => f.Id == historyRequest.UserId);
            if (user == null)
                return HttpResponse.Error(message: "Thành viên này không tồn tại, vui lòng kiểm tra lại!");

            var history = _history.Find(f => f.Id == historyId);
            if (history == null)
                return HttpResponse.Error(message: "Không tìm thấy lịch sử !!!");

            history.Title = historyRequest.Title ?? history.Title;
            history.Description = historyRequest.Description ?? history.Description;
            history.function_status = historyRequest.function_status ?? history.function_status;
            history.UserId = historyRequest.UserId;
            history.ModifiedDate = DateTime.Now;

            _history.Update(history);
            await UnitOfWork.CommitAsync();

            return HttpResponse.Error(message: "Cập nhật lịch sử thành công!");
        }

        public async Task<HttpResponse> DeleteAsync(long historyId)
        {
            var history = _history.Find(f => f.Id == historyId);
            if (history == null)
                return HttpResponse.Error(message: "Không tìm thấy lịch sử !!!");

            _history.Delete(history);
            await UnitOfWork.CommitAsync();

            return HttpResponse.OK(message: "Xoá lịch sử thành công!");
        }

        public List<HistoryResponse> GetHistory(string search, int pageNumber, int pageSize, out int totalRecords, bool isLogin = false, bool isActivity = false)
        {
            var query = _history.All()
                .AsQueryable();

            if (isLogin)
                query = query.Where(s => s.function_status == Function_Enum.Login || s.function_status == Function_Enum.Logout);

            if (isActivity)
                query = query.Where(s => s.function_status != Function_Enum.Login && s.function_status != Function_Enum.Logout);

            if (!string.IsNullOrWhiteSpace(search))
            {
                string searchLower = search.ToLower();
                query = query.Where(s =>
                    (s.Title != null && s.Title.ToLower().Contains(searchLower)) ||
                    (s.Description != null && s.Description.ToLower().Contains(searchLower)) ||
                    (s.UserId != null && s.User.Fullname.ToLower().Contains(searchLower)) ||
                    (s.function_status.HasValue && s.function_status.ToString().ToLower().Contains(searchLower))
                );
            }

            totalRecords = query.Count();

            var pagedQuery = query
                    .OrderByDescending(s => s.CreatedDate)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize);

            var histories = pagedQuery
                .AsEnumerable()
                .Select(s => new HistoryResponse()
                {
                    Id = s.Id,
                    Title = s.Title,
                    Description = s.Description,
                    FunctionStatus = s.function_status.HasValue ? s.function_status.ToString() : null,
                    UserId = s.UserId,
                    Fullname = "",
                    ModifiedDate = s.ModifiedDate
                })
                .ToList();

            var users = _user.All().ToList();

            foreach (var item in histories)
                item.Fullname = users.FirstOrDefault(u => u.Id == item.UserId)?.Fullname ?? string.Empty;

            return histories;
        }
    }
}
