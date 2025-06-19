using Domain.Common.Http;
using Domain.Model.Request.Statistical;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IStatisticalServices
    {
        /// <summary>
        /// Trả về bảng xếp hạng người dùng theo số lượng tài liệu đã tải lên.
        /// </summary>
        /// <returns></returns>
        Task<HttpResponse> GetRanking();
        /// <summary>
        /// Thay đổi trạng thái sao của người dùng cho tài liệu.
        /// </summary>
        /// <param name="starRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> ChangeStatusStar(StarRequest starRequest);
        /// <summary>
        /// Trả về danh sách tài liệu vừa thêm gần đây của người dùng theo id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<HttpResponse> GetRecentUpload(long id);
    }
}
