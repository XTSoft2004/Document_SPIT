using Domain.Common.Http;
using Domain.Model.Request.History;
using Domain.Model.Response.History;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IHistoryServices
    {
        /// <summary>
        /// Tạo mới lịch sử
        /// </summary>
        /// <param name="historyRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> CreateAsync(HistoryRequest historyRequest);
        /// <summary>
        /// Cập nhật lịch sử theo mã lịch sử
        /// </summary>
        /// <param name="historyId"></param>
        /// <param name="historyRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> UpdateAsync(long historyId, HistoryRequest historyRequest);
        /// <summary>
        /// Xoá lịch sử theo mã lịch sử
        /// </summary>
        /// <param name="historyId"></param>
        /// <returns></returns>
        Task<HttpResponse> DeleteAsync(long historyId);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="search"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalRecords"></param>
        /// <param name="isLogin"></param>
        /// <param name="isActivity"></param>
        /// <returns></returns>
        List<HistoryResponse> GetHistory(string search, int pageNumber, int pageSize, out int totalRecords, bool isLogin = false, bool isActivity = false);
    }
}
