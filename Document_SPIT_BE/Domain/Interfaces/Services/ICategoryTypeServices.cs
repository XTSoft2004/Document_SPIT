using Domain.Common.Http;
using Domain.Entities;
using Domain.Model.Request.CategoryType;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface ICategoryTypeServices
    {
        /// <summary>
        /// Tạo mới loại danh mục
        /// </summary>
        /// <param name="categoryTypeRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> CreateAsync(CategoryTypeRequest categoryTypeRequest);
        /// <summary>
        /// Cập nhật loại danh mục theo IdCategoryType  
        /// </summary>
        /// <param name="IdCategoryType"></param>
        /// <param name="categoryTypeRequest"></param>
        /// <returns></returns>
        Task<HttpResponse> UpdateAsync(long IdCategoryType, CategoryTypeRequest categoryTypeRequest);
        /// <summary>
        /// Xoá loại danh mục theo IdCategoryType
        /// </summary>
        /// <param name="IdCategoryType"></param>
        /// <returns></returns>
        Task<HttpResponse> DeleteAsync(long IdCategoryType);
        /// <summary>
        /// Tìm kiếm loại danh mục theo tên, phân trang và trả về danh sách loại danh mục
        /// </summary>
        /// <param name="search"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalRecords"></param>
        /// <returns></returns>
        List<CategoryTypeResponse> GetCategory(string search, int pageNumber, int pageSize, out int totalRecords);
        /// <summary>
        /// Thêm danh sách loại danh mục vào tài liệu
        /// </summary>
        /// <param name="itemCategorys"></param>
        /// <param name="DocumentId"></param>
        /// <returns></returns>
        Task<bool> AddListCategoryDocument(List<CategoryType> itemCategorys, long DocumentId);
    }
}
