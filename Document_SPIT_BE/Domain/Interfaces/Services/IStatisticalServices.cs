using Domain.Common.Http;
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
        /// Lấy các thông số thống kê về tài liệu được đóng góp
        /// </summary>
        /// <returns></returns>
        Task<HttpResponse> ParameterDocument();
        /// <summary>
        /// Trả về biểu đồ đường thể hiện số lượng tài liệu được tạo theo ngày.
        /// </summary>
        /// <returns></returns>
        Task<HttpResponse> LineChartDate(int numberDay = 15);
        /// <summary>
        /// Trả về thống kê tổng quan cho quản trị viên, bao gồm tổng số tài liệu, người dùng, khóa học và các tỷ lệ phần trăm tương ứng.
        /// </summary>
        /// <returns></returns>
        Task<HttpResponse> GetStatisticalAdmin();
    }
}
