using Domain.Base.Services;
using Domain.Common;
using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.GoogleDriver.Model.Response;
using Domain.Common.Http;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Department;
using Domain.Model.Request.History;
using Domain.Model.Response.Department;
using Domain.Model.Response.Token;
using Domain.Model.Response.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class DepartmentServices : BaseService, IDepartmentServices
    {
        private readonly IRepositoryBase<Department> _department;
        private readonly IGoogleDriverServices _googleDriverServices;
        private readonly IHistoryServices _historyServices;
        private readonly ITokenServices _tokenServices;
        private UserTokenResponse? userMeToken;
        
        public DepartmentServices(IRepositoryBase<Department> department, IGoogleDriverServices googleDriverServices, IHistoryServices historyServices, ITokenServices tokenServices)
        {
            _department = department;
            _googleDriverServices = googleDriverServices;
            _historyServices = historyServices;
            _tokenServices = tokenServices;
            userMeToken = _tokenServices.GetTokenBrowser();
            var envPath = Path.Combine(Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).Parent.Parent.Parent.Parent.FullName, ".env");
            DotNetEnv.Env.Load(envPath);
        }
        public async Task<HttpResponse> CreateAsync(DepartmentCreateRequest request)
        {
            var departmentExists = _department.Find(f => f.Code == request.Code);
            if (departmentExists != null)
                return HttpResponse.Error(message: "Mã khoa này đã tồn tại.");

            var department = new Department
            {
                Code = request.Code,
                Name = request.Name,
            };
            _department.Insert(department);
            await UnitOfWork.CommitAsync();

            // Tạo thư mục trên Google Drive nếu có FolderId
            string FOLDER_DOCUMENT = Environment.GetEnvironmentVariable("FOLDER_DOCUMENT");
            var folderDepartment = await _googleDriverServices.CreateFolder(department.Name, FOLDER_DOCUMENT);
            if (folderDepartment.Data is DriverItemResponse folderData)
                department.FolderId = folderData.Id;
            _department.Update(department);
            await UnitOfWork.CommitAsync();

            await _historyServices.CreateAsync(new HistoryRequest 
            { 
                Title = "Tạo khoa", 
                Description = $"Khoa {department.Name} vừa được tạo.", 
                function_status = Function_Enum.Create_Department, 
                UserId = userMeToken?.Id ?? -1 
            });

            return HttpResponse.OK(message: "Tạo khoa thành công.");
        }

        public async Task<HttpResponse> UpdateAsync(long id, DepartmentUpdateRequest request)
        {
            var department = _department.Find(f => f.Id == id);
            if (department == null)
                return HttpResponse.Error(message: "Khoa không tồn tại.");

            department.Code = request.Code ?? department.Code;
            department.Name = request.Name ?? department.Name;
            department.FolderId = request.FolderId ?? department.FolderId;

            _department.Update(department);
            await UnitOfWork.CommitAsync();

            await _historyServices.CreateAsync(new HistoryRequest 
            { 
                Title = "Cập nhật khoa", 
                Description = $"Khoa {department.Name} vừa được cập nhật.", 
                function_status = Function_Enum.Update_Department, 
                UserId = userMeToken?.Id ?? -1 
            });

            return HttpResponse.OK(message: "Cập nhật khoa thành công.");
        }

        public async Task<HttpResponse> DeleteAsync(long id)
        {
            var department = _department.Find(f => f.Id == id);
            if (department == null)
                return HttpResponse.Error(message: "Khoa không tồn tại.");
            
            _department.TotallyDelete(department);
            await UnitOfWork.CommitAsync();
            
            await _historyServices.CreateAsync(new HistoryRequest 
            { 
                Title = "Xóa khoa", 
                Description = $"Khoa {department.Name} vừa được xóa.", 
                function_status = Function_Enum.Delete_Department, 
                UserId = userMeToken?.Id ?? -1 
            });
            
            return HttpResponse.OK(message: "Xoá khoa thành công.");
        }

        public List<DepartmentResponse>? GetDepartment(string search, int pageNumber, int pageSize, out int totalRecords)
        {
            var query = _department!.All();
            if (!string.IsNullOrEmpty(search))
            {
                string searchLower = search.ToLower();

                query = query.Where(d =>
                    (d.Name != null && d.Name.ToLower().Contains(searchLower)) ||
                    (d.Code != null && d.Code.ToLower().Contains(searchLower))
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
            var departmentsSearch = query.Select(d => new DepartmentResponse
            {
                Id = d.Id,
                Code = d.Code,
                Name = d.Name,
                FolderId = d.FolderId
            }).ToList();

            return departmentsSearch;
        }
    }
}
