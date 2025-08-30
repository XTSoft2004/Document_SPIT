using Domain.Common.Http;
using Domain.Model.Request.Course;
using Domain.Model.Response.Course;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface ICourseServices
    {
        /// <summary>
        /// Tạo mới một học phần.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        Task<HttpResponse> CreateAsync(CourseCreateRequest request);
        /// <summary>
        /// Cập nhật thông tin học phần theo ID.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        Task<HttpResponse> UpdateAsync(long id, CourseRequest request);
        /// <summary>
        /// Xoá một học phần theo ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<HttpResponse> DeleteAsync(long id);
        /// <summary>
        /// Lấy danh sách học phần với phân trang và tìm kiếm.
        /// </summary>
        /// <param name="search"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalRecords"></param>
        /// <returns></returns>
        List<CourseResponse>? GetCourse(string search, int pageNumber, int pageSize, out int totalRecords);
        /// <summary>
        /// Lấy một học phần theo ID.
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        Task<HttpResponse> GetCourseById(long? Id);
    }
}
