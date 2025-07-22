using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Response.Statistical;
using Domain.Model.Response.User;
using Newtonsoft.Json.Linq;
using Sprache;
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
        public async Task<HttpResponse> GetStatisticalAdmin()
        {
            // Lấy danh sách tài liệu, người dùng, môn học
            var documents = _document.All().ToList();
            var users = _user.All().ToList();
            var courses = documents.Select(d => d.CourseId).Distinct().Count();

            // Lấy tổng số tài liệu, người dùng và môn học 
            long? totalDocument = documents.Count;
            long? totalUser = users.Count;
            long? totalCourse = courses;

            // Lấy số lượng tài liệu, người dùng, môn học trong ngày hôm nay
            var today = DateTime.Now.Date;
            long? todayDocument = documents.Count(d => d.CreatedDate.Date == today);
            long? todayUser = users.Count(u => u.CreatedDate.Date == today);
            long? todayCourse = documents.Where(d => d.CreatedDate.Date == today).Select(d => d.CourseId).Distinct().Count();

            var pastDay = DateTime.Now.Date.AddDays(-1);
            long? pastDayDocument = documents.Count(d => d.CreatedDate.Date == pastDay);

            double? percentDocument = totalDocument > 0 ? (double)todayDocument / totalDocument * 100 : 0;
            double? percentUser = totalUser > 0 ? (double)todayUser / totalUser * 100 : 0;
            double? percentCourse = totalCourse > 0 ? (double)todayCourse / totalCourse * 100 : 0;
            double? percentPastDayDocument = totalDocument > 0 ? (double)pastDayDocument / todayDocument * 100 : 0;

            var data = new StatisticalAdminResponse
            {
                TotalDocuments = totalDocument,
                TotalUsers = totalUser,
                TotalCourses = totalCourse,
                TotalDocumentToday = todayDocument,
                PercentDocuments = percentDocument,
                PercentUsers = percentUser,
                PercentCourses = percentCourse,
                PercentDocumentToday = percentPastDayDocument
            };

            return HttpResponse.OK(
                message: "Lấy thống kê thành công.",
                data: data
            );
        }
    }
}
