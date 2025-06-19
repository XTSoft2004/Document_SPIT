using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Statistical;
using Domain.Model.Response.Statistical;
using System.Linq;


namespace Domain.Services
{
    public class StatisticalServices : BaseService, IStatisticalServices
    {
        public readonly IRepositoryBase<User> _user;
        public readonly IRepositoryBase<Document> _document;
        public readonly IRepositoryBase<StarDocument> _startDocument;

        public StatisticalServices(IRepositoryBase<User> user, IRepositoryBase<Document> document, IRepositoryBase<StarDocument> startDocument)
        {
            _user = user;
            _document = document;
            _startDocument = startDocument;
        }

        public async Task<HttpResponse> GetRanking()
        {
            // Lấy danh sách người dùng và đếm số lượng tài liệu đã tải lên của mỗi người
            // Sắp xếp theo số lượng tài liệu đã tải lên giảm dần
            var ranking = _user.All().ToList().Select(
                u => new RankingResponse
                {
                    UserId = u.Id,
                    TotalUpload = _document.All().Count(d => d.UserId == u.Id)
                })
                .Where(r => r.TotalUpload > 0)
                .OrderByDescending(r => r.TotalUpload)
                .ToList();

            return HttpResponse.OK(message: "Lấy bảng xếp hạng thành công.", data: ranking);
        }

        public async Task<HttpResponse> ChangeStatusStar(StarRequest starRequest)
        {
            // Kiểm tra xem người dùng có tồn tại không
            var user = _user.Find(u => u.Id == starRequest.UserId);
            if (user == null)
                return HttpResponse.Error(message: "Người dùng không tồn tại.", System.Net.HttpStatusCode.NotFound);

            // Kiểm tra xem người dùng đã đánh sao cho tài liệu này hay chưa
            var f = _startDocument.Find(f => f.UserId == starRequest.UserId && f.DocumentId == starRequest.DocumentId);
            // Nếu đã đánh sao thì xóa sao
            if (f != null)
            {
                _startDocument.Delete(f);
                await UnitOfWork.CommitAsync();
            }
            // nếu chưa thì thêm sao
            else
            {
                var star = new StarDocument
                {
                    UserId = starRequest.UserId,
                    DocumentId = starRequest.DocumentId
                };

                _startDocument.Insert(star);
                await UnitOfWork.CommitAsync();
            }

            return HttpResponse.OK(message: "Cập nhật trạng thái sao thành công.");
        }
        
        public async Task<HttpResponse> GetRecentUpload(long id)
        {
            // Kiểm tra xem người dùng có tồn tại không
            var user = _user.Find(u => u.Id == id);
            if (user == null)
                return HttpResponse.Error(message: "Người dùng không tồn tại.", System.Net.HttpStatusCode.NotFound);

            // Lấy danh sách tài liệu đã tải lên gần đây của người dùng theo id
            var data = _document.All()
                .Where(d => d.UserId == id)
                .OrderByDescending(d => d.ModifiedDate)
                .Take(10)
                .Select(d => new RecentUploadResponse
                {
                    Id = d.Id,
                    Name = d.Name,
                    ModifiedDate = d.ModifiedDate,
                })
                .ToList();

            return HttpResponse.OK(message: "Lấy danh sách tài liệu tải lên gần đây thành công.", data: data);
        }
    }
}
