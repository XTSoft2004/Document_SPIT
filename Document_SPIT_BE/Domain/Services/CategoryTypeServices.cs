using Domain.Base.Services;
using Domain.Common;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Auth;
using Domain.Model.Request.CategoryType;
using Domain.Model.Request.History;
using Domain.Model.Response.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class CategoryTypeServices : BaseService, ICategoryTypeServices
    {
        private readonly IRepositoryBase<CategoryType>? _categoryType;
        private readonly IRepositoryBase<DocumentCategory>? _documentCategory;
        private readonly IHistoryServices _historyServices;
        private readonly ITokenServices? _tokenServices;
        private UserTokenResponse? userMeToken;

        public CategoryTypeServices(IRepositoryBase<CategoryType>? categoryType, IRepositoryBase<DocumentCategory>? documentCategory, IHistoryServices historyServices, ITokenServices? tokenServices)
        {
            _categoryType = categoryType;
            _documentCategory = documentCategory;
            _historyServices = historyServices;
            _tokenServices = tokenServices;
            userMeToken = _tokenServices.GetTokenBrowser();
        }
        // Tạo mới loại danh mục
        public async Task<HttpResponse> CreateAsync(CategoryTypeRequest categoryTypeRequest)
        {
            var categoryType = _categoryType.Find(f => f.Name == categoryTypeRequest.Name.Trim());
            if (categoryType != null)
                return HttpResponse.Error("Loại danh mục đã tồn tại.", System.Net.HttpStatusCode.BadRequest);

            var newCategoryType = new CategoryType()
            {
                Name = categoryTypeRequest.Name.Trim(),
                Description = categoryTypeRequest.Description?.Trim(),

                CreatedDate = DateTime.Now,
                CreatedBy = userMeToken.Username
            };

            _categoryType.Insert(newCategoryType);
            await UnitOfWork.CommitAsync();

            await _historyServices.CreateAsync(new HistoryRequest
            {
                Title = "Tạo danh mục",
                Description = $"Danh mục {newCategoryType.Name} vừa được tạo.",
                function_status = Function_Enum.Create_CategoryType,
                UserId = userMeToken.Id ?? -1
            });

            return HttpResponse.OK(message: "Tạo loại danh mục thành công.");
        }
        // Cập nhật loại danh mục theo IdCategoryType
        public async Task<HttpResponse> UpdateAsync(long IdCategoryType, CategoryTypeRequest categoryTypeRequest)
        {
            var categoryType = _categoryType.Find(f => f.Id == IdCategoryType);
            if (categoryType == null)
                return HttpResponse.Error("Loại danh mục không tồn tại.", System.Net.HttpStatusCode.NotFound);
            
            categoryType.Name = categoryTypeRequest.Name?.Trim() ?? categoryType.Name;
            categoryType.Description = categoryTypeRequest.Description?.Trim() ?? categoryType.Description;

            categoryType.ModifiedDate = DateTime.Now;
            categoryType.ModifiedBy = userMeToken.Username;

            _categoryType.Update(categoryType);
            await UnitOfWork.CommitAsync();

            await _historyServices.CreateAsync(new HistoryRequest
            {
                Title = "Cập nhật danh mục",
                Description = $"Danh mục {categoryType.Name} vừa được cập nhật.",
                function_status = Function_Enum.Update_CategoryType,
                UserId = userMeToken.Id ?? -1
            });

            return HttpResponse.OK(message: "Cập nhật loại danh mục thành công.");
        }
        // Xoá loại danh mục theo IdCategoryType
        public async Task<HttpResponse> DeleteAsync(long IdCategoryType)
        {
            var categoryType = _categoryType.Find(f => f.Id == IdCategoryType);
            if (categoryType == null)
                return HttpResponse.Error("Loại danh mục không tồn tại.", System.Net.HttpStatusCode.NotFound);
            
            _categoryType.Delete(categoryType);
            await UnitOfWork.CommitAsync();

            await _historyServices.CreateAsync(new HistoryRequest
            {
                Title = "Xoá danh mục",
                Description = $"Danh mục {categoryType.Name} vừa được xoá.",
                function_status = Function_Enum.Delete_CategoryType,
                UserId = userMeToken.Id ?? -1
            });

            return HttpResponse.OK(message: "Xoá loại danh mục thành công.");
        }
        public List<CategoryTypeResponse> GetCategory(string search, int pageNumber, int pageSize, out int totalRecords)
        {
            var query = _categoryType!.All();
            if (!string.IsNullOrEmpty(search))
            {
                string searchLower = search.ToLower();

                query = query.Where(d =>
                    (d.Name != null && d.Name.ToLower().Contains(searchLower)) ||
                    (d.Description != null && d.Description.ToLower().Contains(searchLower))
                );
            }
            // Đếm số bản ghi trước khi phân trang
            totalRecords = query.Count();
            // Sắp xếp theo ModifiedDate
            query = query.OrderByDescending(d => d.ModifiedDate);
            if (pageNumber != -1 && pageSize != -1)
            {
                query = query.Skip((pageNumber - 1) * pageSize).Take(pageSize);
            }

            // Chuyển đổi sang danh sách DepartmentResponse
            var categoriesSearch = query.Select(d => new CategoryTypeResponse
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description
            }).ToList();

            return categoriesSearch;
        }
        public async Task<bool> AddListCategoryDocument(List<CategoryType> itemCategorys, long DocumentId)
        {
            // Lấy tất cả DocumentCategory hiện tại của DocumentId
            var currentDocumentCategories = _documentCategory!.ListBy(dc => dc.DocumentId == DocumentId).ToList();

            // Lấy danh sách CategoryId từ itemCategorys
            var newCategoryIds = itemCategorys.Select(c => c.Id).ToList();

            // Xác định các DocumentCategory cần xóa (không còn trong danh sách mới)
            var toRemove = currentDocumentCategories
                .Where(dc => !newCategoryIds.Contains(dc.CategoryId))
                .ToList();

            if (toRemove.Any())
            {
                _documentCategory.DeleteRange(toRemove);
            }

            // Xác định các CategoryId cần thêm mới (chưa có trong currentDocumentCategories)
            var currentCategoryIds = currentDocumentCategories.Select(dc => dc.CategoryId).ToList();
            var toAdd = newCategoryIds
                .Where(id => !currentCategoryIds.Contains(id))
                .Select(id => new DocumentCategory
                {
                    DocumentId = DocumentId,
                    CategoryId = id
                })
                .ToList();

            if (toAdd.Any())
            {
                _documentCategory.InsertRange(toAdd);
            }

            await UnitOfWork.CommitAsync();
            return true;
        }
    }
}
