using Domain.Base.Services;
using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.GoogleDriver.Model.Response;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Course;
using Domain.Model.Response.Course;
using Domain.Model.Response.Department;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class CourseServices : BaseService, ICourseServices
    {
        private readonly IRepositoryBase<Course> _course;
        private readonly IRepositoryBase<Department> _department;
        private readonly IGoogleDriverServices _googleDriverServices;
        public CourseServices(IRepositoryBase<Course> course, IRepositoryBase<Department> department, IGoogleDriverServices googleDriverServices)
        {
            _course = course;
            _department = department;
            _googleDriverServices = googleDriverServices;
        }

        public async Task<HttpResponse> CreateAsync(CourseCreateRequest request)
        {
            var courseExists = _course.Find(f => f.Code == request.Code);
            if (courseExists != null)
                return HttpResponse.Error(message: "Mã học phần này đã tồn tại.");

            var department = _department.Find(f => f.Id == request.DepartmentId);
            if (department == null)
                return HttpResponse.Error(message: "Khoa không tồn tại.");

            var course = new Course
            {
                Code = request.Code,
                Name = request.Name,
                DepartmentId = department.Id
            };
            _course.Insert(course);
            await UnitOfWork.CommitAsync();

            string FOLDER_DOCUMENT = Environment.GetEnvironmentVariable("FOLDER_DOCUMENT");
            var folderDepartment = await _googleDriverServices.CreateFolder(course.Name, department.FolderId);
            if (folderDepartment.Data is DriverItemResponse folderData)
                course.FolderId = folderData.Id;
            _course.Update(course);
            await UnitOfWork.CommitAsync();

            return HttpResponse.OK(message: "Tạo học phần thành công.");
        }

        public async Task<HttpResponse> UpdateAsync(long id, CourseRequest request)
        {
            var course = _course.Find(f => f.Id == id);
            if (course == null)
                return HttpResponse.Error(message: "Học phần không tồn tại.");
            course.Code = request.Code ?? course.Code;
            course.Name = request.Name ?? course.Name;
            course.FolderId = request.FolderId ?? course.FolderId;
            if (request.DepartmentId.HasValue)
            {
                var department = _department.Find(f => f.Id == request.DepartmentId.Value);
                if (department == null)
                    return HttpResponse.Error(message: "Khoa không tồn tại.");
                course.DepartmentId = department.Id;
            }
            _course.Update(course);
            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: "Cập nhật học phần thành công.");
        }

        public async Task<HttpResponse> DeleteAsync(long id)
        {
            var course = _course.Find(f => f.Id == id);
            if (course == null)
                return HttpResponse.Error(message: "Học phần không tồn tại.");
            _course.Delete(course);
            await UnitOfWork.CommitAsync();
            return HttpResponse.OK(message: "Xóa học phần thành công.");
        }

        public List<CourseResponse>? GetCourse(string search, int pageNumber, int pageSize, out int totalRecords)
        {
            var query = _course!.All();
            if (!string.IsNullOrEmpty(search))
            {
                string searchLower = search.ToLower();

                query = query.Where(d =>
                    (d.Name != null && d.Name.ToLower().Contains(searchLower)) ||
                    (d.Code != null && d.Code.ToLower().Contains(searchLower)) ||
                    (d.Department != null && d.Department.Name != null && d.Department.Name.ToLower().Contains(searchLower))
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
            var coursesSearch = query.Select(c => new CourseResponse
            {
                Id = c.Id,
                Code = c.Code,
                Name = c.Name,
                FolderId = c.FolderId,
                DepartmentId = c.DepartmentId,
            }).ToList();    

            return coursesSearch;
        }
    }
}
