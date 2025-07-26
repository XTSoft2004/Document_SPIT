using Domain.Base.Services;
using Domain.Common;
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
        public readonly IRepositoryBase<DetailDocument> _detailDocument;
        public readonly IRepositoryBase<StarDocument> _starDocument;

        public StatisticalServices(IRepositoryBase<User> user, IRepositoryBase<Document> document, IRepositoryBase<DetailDocument> detailDocument, IRepositoryBase<StarDocument> starDocument)
        {
            _user = user;
            _document = document;
            _detailDocument = detailDocument;
            _starDocument = starDocument;
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
                        Username = user.Username,
                        AvatarUrl = user.AvatarUrl,
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
            var documents = _document.All()
                .Where(d => d.StatusDocument == StatusDocument_Enum.Approved)
                .ToList();

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
            var documents = _document.All()
                .Where(w => w.StatusDocument == StatusDocument_Enum.Approved)
                .ToList();

            var users = _user.All().ToList();
            var courses = documents.Select(d => d.CourseId).Distinct().Count();

            // Tổng số
            long totalDocument = documents.Count;
            long totalUser = users.Count;
            long totalCourse = courses;

            // Thống kê hôm nay
            var today = DateTime.Now.Date;
            long todayDocument = documents.Count(d => d.CreatedDate.Date == today);
            long todayUser = users.Count(u => u.CreatedDate.Date == today);
            long todayCourse = documents
                .Where(d => d.CreatedDate.Date == today)
                .Select(d => d.CourseId)
                .Distinct()
                .Count();

            // Thống kê hôm qua
            var yesterday = today.AddDays(-1);
            long yesterdayDocument = documents.Count(d => d.CreatedDate.Date == yesterday);

            // Tính tỷ lệ phần trăm so với tổng
            double percentDocument = totalDocument > 0 ? (double)todayDocument / totalDocument * 100 : 0;
            double percentUser = totalUser > 0 ? (double)todayUser / totalUser * 100 : 0;
            double percentCourse = totalCourse > 0 ? (double)todayCourse / totalCourse * 100 : 0;

            // Tính phần trăm so sánh số tài liệu hôm nay so với hôm qua
            double percentTodayVsYesterday = yesterdayDocument > 0
                ? (double)todayDocument / yesterdayDocument * 100
                : 0;

            var data = new StatisticalAdminResponse
            {
                TotalDocuments = totalDocument,
                TotalUsers = totalUser,
                TotalCourses = totalCourse,
                TotalDocumentToday = todayDocument,
                PercentDocuments = Math.Round(percentDocument, 2),
                PercentUsers = Math.Round(percentUser, 2),
                PercentCourses = Math.Round(percentCourse, 2),
                PercentDocumentToday = Math.Round(percentTodayVsYesterday, 2)
            };

            return HttpResponse.OK(
                message: "Lấy thống kê thành công.",
                data: data
            );
        }

        #region GetStatisticalUser
        public async Task<HttpResponse> GetStatisticalUser(string username)
        {
            var userId = _user.All().FirstOrDefault(u => u.Username.ToLower() == username.ToLower().Trim())?.Id;
            if (userId == null)
            {
                return HttpResponse.Error(message: "Người dùng không tồn tại.",
                    statusCode: HttpStatusCode.NotFound
                );
            }

            var documents = _document.All().Where(d => d.UserId == userId).ToList();
            var detailDocuments = _detailDocument.All().ToList();
            var starDocuments = _starDocument.All().ToList();

            // Lấy tổng số tài liệu đã tải lên của người dùng
            var userDocuments = documents.Where(d => d.UserId == userId).ToList();

            // Lấy tổng số lượt tải xuống và lượt xem của người dùng
            var totalDownloads = detailDocuments.Where(dd => dd.DocumentId.HasValue && userDocuments.Any(d => d.Id == dd.DocumentId.Value)).Sum(dd => dd.TotalDownload) ?? 0;
            var totalViews = detailDocuments.Where(dd => dd.DocumentId.HasValue && userDocuments.Any(d => d.Id == dd.DocumentId.Value)).Sum(dd => dd.TotalView) ?? 0;

            // Lấy tổng số lượt sao của người dùng
            var totalStars = starDocuments.Count(sd => sd.UserId == userId);

            var data = new StatisticalUserResponse
            {
                TotalDocuments = userDocuments.Count,
                TotalDownloads = totalDownloads,
                TotalViews = totalViews,
                TotalStars = totalStars
            };

            return HttpResponse.OK(
                message: "Lấy thống kê người dùng thành công.",
                data: data
            );
        }
        #endregion
    }
}
