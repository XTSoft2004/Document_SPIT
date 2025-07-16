using Domain.Common.Http;
using Domain.Model.Request.History;
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
        /// Lấy danh sách lịch sử, lấy 10 lịch sử gần nhất
        /// </summary>
        /// <param name="sizePage"></param>
        /// <returns></returns>
        Task<HttpResponse> GetHistory(int sizePage = 10);
    }
}
