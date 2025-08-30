using Domain.Base.Services;
using Domain.Common;
using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.GoogleDriver.Model.Response;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Course;
using Domain.Model.Request.History;
using Domain.Model.Response.Course;
using Domain.Model.Response.Department;
using Domain.Model.Response.Token;
using Domain.Model.Response.User;
using Microsoft.EntityFrameworkCore;
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
        private readonly IHistoryServices _historyServices;
        private readonly ITokenServices _tokenServices;
        private UserTokenResponse? userMeToken;
        
        public CourseServices(IRepositoryBase<Course> course, IRepositoryBase<Department> department, IGoogleDriverServices googleDriverServices, IHistoryServices historyServices, ITokenServices tokenServices)
        {
            _course = course;
            _department = department;
            _googleDriverServices = googleDriverServices;
            _historyServices = historyServices;
            _tokenServices = tokenServices;
            userMeToken = _tokenServices.GetTokenBrowser();
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
                DepartmentId = department.Id,

                CreatedDate = DateTime.Now,
                CreatedBy = userMeToken.Username,
            };
            _course.Insert(course);
            await UnitOfWork.CommitAsync();

            string FOLDER_DOCUMENT = Environment.GetEnvironmentVariable("FOLDER_DOCUMENT");
            var folderDepartment = await _googleDriverServices.CreateFolder(course.Name, department.FolderId);
            if (folderDepartment.Data is DriverItemResponse folderData)
                course.FolderId = folderData.Id;
            _course.Update(course);
            await UnitOfWork.CommitAsync();

            await _historyServices.CreateAsync(new HistoryRequest 
            { 
                Title = "Tạo học phần", 
                Description = $"Học phần {course.Name} vừa được tạo.", 
                function_status = Function_Enum.Create_Course, 
                UserId = userMeToken?.Id ?? -1 
            });

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


            course.ModifiedDate = DateTime.Now;
            course.ModifiedBy = userMeToken.Username;
            if (request.DepartmentId.HasValue)
            {
                var department = _department.Find(f => f.Id == request.DepartmentId.Value);
                if (department == null)
                    return HttpResponse.Error(message: "Khoa không tồn tại.");
                course.DepartmentId = department.Id;
            }
            _course.Update(course);
            await UnitOfWork.CommitAsync();
            
            await _historyServices.CreateAsync(new HistoryRequest 
            { 
                Title = "Cập nhật học phần", 
                Description = $"Học phần {course.Name} vừa được cập nhật.", 
                function_status = Function_Enum.Update_Course, 
                UserId = userMeToken?.Id ?? -1 
            });
            
            return HttpResponse.OK(message: "Cập nhật học phần thành công.");
        }

        public async Task<HttpResponse> DeleteAsync(long id)
        {
            var course = _course.Find(f => f.Id == id);
            if (course == null)
                return HttpResponse.Error(message: "Học phần không tồn tại.");
            
            _course.Delete(course);
            await UnitOfWork.CommitAsync();
            
            await _historyServices.CreateAsync(new HistoryRequest 
            { 
                Title = "Xóa học phần", 
                Description = $"Học phần {course.Name} vừa được xóa.", 
                function_status = Function_Enum.Delete_Course, 
                UserId = userMeToken?.Id ?? -1 
            });
            
            return HttpResponse.OK(message: "Xóa học phần thành công.");
        }

        public List<CourseResponse>? GetCourse(string search, int pageNumber, int pageSize, out int totalRecords)
        {
            var query = _course.All()
                .Select(c => new CourseResponse
                {
                    Id = c.Id,
                    Code = c.Code,
                    Name = c.Name,
                    FolderId = c.FolderId,
                    DepartmentId = c.DepartmentId,
                });

            if (!string.IsNullOrEmpty(search))
            {
                string searchLower = search.ToLower();
                query = query.Where(c =>
                    (c.Name != null && c.Name.ToLower().Contains(searchLower)) ||
                    (c.Code != null && c.Code.ToLower().Contains(searchLower))
                );
            }

            totalRecords = query.Count(); // Tổng số bản ghi trước phân trang

            // Phân trang
            var paginatedCourses = query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return paginatedCourses;
        }
        public async Task<HttpResponse> GetCourseById(long? Id)
        {
            var course = _course.Find(f => f.Id == Id);
            if(course == null)
                return HttpResponse.Error(message: "Học phần không tồn tại.");

            var courseResponse = new CourseResponse
            {
                Id = course.Id,
                Code = course.Code,
                Name = course.Name,
                FolderId = course.FolderId,
                DepartmentId = course.DepartmentId,
            };
            return HttpResponse.OK(data: courseResponse, message: "Lấy thông tin học phần thành công.");
        }
    }
}
