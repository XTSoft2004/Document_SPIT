using Domain.Common.Http;
using Domain.Model.Request.Department;
using Domain.Model.Response.Department;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IDepartmentServices
    {
        /// <summary>
        /// Tạo mới một khoa.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        Task<HttpResponse> CreateAsync(DepartmentCreateRequest request);
        /// <summary>
        /// Cập nhật thông tin khoa theo ID.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        Task<HttpResponse> UpdateAsync(long id, DepartmentUpdateRequest request);
        /// <summary>
        /// Xoá một khoa theo ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<HttpResponse> DeleteAsync(long id);
        /// <summary>
        /// Lấy danh sách khoa với phân trang và tìm kiếm.
        /// </summary>
        /// <param name="search"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalRecords"></param>
        /// <returns></returns>
        List<DepartmentResponse>? GetDepartment(string search, int pageNumber, int pageSize, out int totalRecords);
    }
}
