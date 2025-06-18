using Domain.Base.Services;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.CategoryType;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class CategoryTypeServices : BaseService, ICategoryTypeServices
    {
        private readonly IRepositoryBase<CategoryType>? _categoryType;

        public CategoryTypeServices(IRepositoryBase<CategoryType>? categoryType)
        {
            _categoryType = categoryType;
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
                Description = categoryTypeRequest.Description?.Trim()
            };

            _categoryType.Insert(newCategoryType);
            await UnitOfWork.CommitAsync();

            return HttpResponse.OK(newCategoryType, "Tạo loại danh mục thành công.");
        }
        // Cập nhật loại danh mục theo IdCategoryType
        public async Task<HttpResponse> UpdateAsync(long IdCategoryType, CategoryTypeRequest categoryTypeRequest)
        {
            var categoryType = _categoryType.Find(f => f.Id == IdCategoryType);
            if (categoryType == null)
                return HttpResponse.Error("Loại danh mục không tồn tại.", System.Net.HttpStatusCode.NotFound);
            
            categoryType.Name = categoryTypeRequest.Name?.Trim() ?? categoryType.Name;
            categoryType.Description = categoryTypeRequest.Description?.Trim() ?? categoryType.Description;

            _categoryType.Update(categoryType);
            await UnitOfWork.CommitAsync();

            return HttpResponse.OK(categoryType, "Cập nhật loại danh mục thành công.");
        }
        // Xoá loại danh mục theo IdCategoryType
        public async Task<HttpResponse> DeleteAsync(long IdCategoryType)
        {
            var categoryType = _categoryType.Find(f => f.Id == IdCategoryType);
            if (categoryType == null)
                return HttpResponse.Error("Loại danh mục không tồn tại.", System.Net.HttpStatusCode.NotFound);
            
            _categoryType.Delete(categoryType);
            await UnitOfWork.CommitAsync();

            return HttpResponse.OK(message: "Xoá loại danh mục thành công.");
        }
    }
}
