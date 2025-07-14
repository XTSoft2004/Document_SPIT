using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Response.Statistical;
using Domain.Model.Response.User;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Net;


namespace Domain.Services
{
    public class StatisticalServices : BaseService, IStatisticalServices
    {
        public readonly IRepositoryBase<User> _user;
        public readonly IRepositoryBase<Document> _document;

        public StatisticalServices(IRepositoryBase<User> user, IRepositoryBase<Document> document)
        {
            _user = user;
            _document = document;
        }

        public async Task<HttpResponse> GetRanking()
        {
            // Lấy danh sách người dùng và tài liệu
            var users = _user.All().ToList();
            var documents = _document.All().ToList();

            // Tạo bảng xếp hạng
            var ranking = new List<RankingResponse>();

            foreach (var user in users)
            {
                // Lấy số lượng tài liệu đã tải lên của người dùng
                var documentCount = documents.Count(d => d.UserId == user.Id);
                // Thêm vào bảng xếp hạng
                if (documentCount != 0)
                    ranking.Add(new RankingResponse
                    {
                        Fullname = user.Fullname,
                        TotalUpload = documentCount,
                    });
            }

            // Trả kết quả
            return HttpResponse.OK(
                message: "Lấy bảng xếp hạng thành công.",
                data: ranking
            );
        }
        public async Task<HttpResponse> ParameterDocument()
        {
            var documents = _document.All().ToList();

            long? totalDocument = documents.Count;
            long? totalUserContribute = documents.Select(d => d.UserId).Distinct().Count();
            long? totalCourse = documents.Select(d => d.CourseId).Distinct().Count();

            return HttpResponse.OK(
                message: "Lấy thông tin tài liệu thành công.",
                data: new ParameterDocumentResponse
                {
                    TotalDocumentShare = totalDocument,
                    TotalUserContribute = totalUserContribute,
                    TotalCourseShare = totalCourse
                }
            );
        }

        public async Task<HttpResponse> LineChartDate(int numberDay = 15)
        {
            // Lấy danh sách tài liệu
            var documents = _document.All().ToList();

            // Xác định khoảng ngày cần thống kê
            var startDate = DateTime.Now.Date.AddDays(-numberDay + 1);
            var endDate = DateTime.Now.Date;
            var dateRange = Enumerable.Range(0, (endDate - startDate).Days + 1)
                .Select(offset => startDate.AddDays(offset))
                .ToList();

            // Nhóm tài liệu theo ngày tạo trong khoảng thời gian
            var groupedDocuments = documents
                .Where(d => d.CreatedDate.Date >= startDate && d.CreatedDate.Date <= endDate)
                .GroupBy(d => d.CreatedDate.Date)
                .ToDictionary(g => g.Key, g => g.Count());

            // Tạo dữ liệu cho tất cả các ngày, kể cả ngày không có tài liệu
            var data = dateRange
                .Select(date => new LineCharDateResponse
                {
                    Date = date.ToString("yyyy-MM-dd"),
                    File = groupedDocuments.ContainsKey(date) ? groupedDocuments[date] : 0
                })
                .ToList();

            return HttpResponse.OK(
                message: "Lấy dữ liệu biểu đồ thành công.",
                data: data
            );
        }
    }
}
