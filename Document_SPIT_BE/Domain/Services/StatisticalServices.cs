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
    }
}
