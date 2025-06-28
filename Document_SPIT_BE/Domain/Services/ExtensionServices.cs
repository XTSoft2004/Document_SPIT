using Domain.Base.Services;
using Domain.Common;
using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.GoogleDriver.Model.Response;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Course;
using Domain.Model.Request.Department;
using Domain.Model.Request.Document;
using HelperHttpClient;
using HtmlAgilityPack;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class ExtensionServices : BaseService, IExtensionServices
    {
        private readonly IGoogleDriverServices _googleDriverServices;
        private readonly IDocumentServices _documentServices;
        private readonly IRepositoryBase<DetailDocument> _detailDocument;
        private readonly IRepositoryBase<User> _user;
        private readonly IRepositoryBase<Document> _document;
        private readonly IRepositoryBase<Department> _department;
        private readonly IRepositoryBase<Course> _course;

        private readonly ICourseServices _courseServices;
        private readonly IDepartmentServices _departmentServices;
        public ExtensionServices(IGoogleDriverServices googleDriverServices, IDocumentServices documentServices, IRepositoryBase<User> user, IRepositoryBase<Document> document, IRepositoryBase<DetailDocument> detailDocument, IRepositoryBase<Department> department, IRepositoryBase<Course> course, ICourseServices courseServices, IDepartmentServices departmentServices)
        {
            _googleDriverServices = googleDriverServices;
            _documentServices = documentServices;
            _user = user;
            _document = document;
            _detailDocument = detailDocument;
            _department = department;
            _course = course;
            _courseServices = courseServices;
            _departmentServices = departmentServices;
        }

        public async Task LoadFolderDriver(string folderId)
        {
            var userAdmin = _user.Find(f => f.Username == "admin"); 
            var course = _course.Find(f => f.Id == 1);
            List<DriverItemResponse?> itemsInfo = await _googleDriverServices.GetInfoFolder(folderId);
            foreach (DriverItemResponse item in itemsInfo)
            {
                if(item == null)
                    continue;

                if (!item.IsFolder)
                {
                    Console.WriteLine($"Tạo mới tài liệu: {item.Name} - {item.Id}");
                    // Tạo mới tài liệu từ Google Drive
                    var documentCreate = new Document
                    {
                        Name = item.Name,
                        FileId = item.Id,
                        FileName = item.Name,
                        Md5Checksum = item.Md5Checksum ?? string.Empty,
                        IsPrivate = false, // Mặc định là công khai
                        StatusDocument = StatusDocument_Enum.Approved,
                        UserId = userAdmin?.Id ?? 0, // Gán người dùng admin
                        User = userAdmin,
                        FolderId = folderId,
                        Course = course,
                        CourseId = course?.Id,
                        CreatedDate = DateTime.Now
                    };
                    _document.Insert(documentCreate);
                    await UnitOfWork.CommitAsync();

                    // Tạo mới chi tiết tài liệu
                    var detailDocument = new DetailDocument
                    {
                        DocumentId = documentCreate.Id,
                        Document = documentCreate,
                        CreatedDate = DateTime.Now
                    };
                    _detailDocument?.Insert(detailDocument);
                    await UnitOfWork.CommitAsync();

                    // Cập nhật tài liệu với chi tiết tài liệu
                    documentCreate.DetaiDocument = detailDocument;
                    documentCreate.DetaiDocumentId = detailDocument.Id;
                    _detailDocument.Update(detailDocument);
                    await UnitOfWork.CommitAsync();
                }
                else
                {
                    Console.WriteLine($"Tạo mới thư mục: {item.Name} - {item.Id}");
                    await LoadFolderDriver(item.Id);
                }    
            }
        }
        public async Task LoadModifiedDate()
        {
            var documents = _document.All().ToList();
            foreach (var document in documents)
            {
                document.ModifiedDate = DateTime.Now;
                _document.Update(document);
            }
            await UnitOfWork.CommitAsync();
        }

        public async Task LoadDepartmentDocument()
        {
            string cookie = "ASP.NET_SessionId=u5zhtrp41p1ih4ixwiej2exm;__RequestVerificationToken=ec4fdKKRryWLXSyYKdJLTTYxxlsDUsKJy4A61C0N2EwsD1yXkWl--G8f1qfjkwe2LvN8VAkhJKI6_GChwnkKCKf6yA41;UMS.StudentPortal.F5C0A1C9384C2E25E79BA1ABF5D9A037=4A0C91C55A689C2A1AFE60D79A50AE05400D489D1284FFADF928EFCDCD5C536B151C17E6A6C046C4AAC596F082BC0F868928702A35216ECD87E2CD46619408FB2A0DEC6E2F4C3ABC00064FA4FD672055099D11EE1A78F43AAE55AEA6BFA0BAFB60D8121649BACB6DA75593E832E751BEDC9045660C3283626D8FF179B9639593699A2F1087646A0AD1E14AD276E59FA1DE0A06F08D934E3517A3A7A78CA3081CD38DC47ABBA3DCDB9E4BF1D982A4447CEDB2B2B4C1834309787DDB24EF049195D6A631BDE9F08F8F438DF722205E6A259AFD8389C1A9D87121D358B346EE56F8F4D05D58EB6E4936B272BB262D5C835702687EF34DB3FC9ADBBFB8EFF97643D2A3478CF0";
            RequestHttpClient _request = new RequestHttpClient();
            _request.SetCookie(cookie, "/", "student.husc.edu.vn");

            string[] courseId = File.ReadAllLines("G:\\Learn_HUSC\\Project_CaNhan\\Document_SPIT\\Document_SPIT_BE\\Document_SPIT_BE\\CourseList.txt");
            foreach(var course in courseId)
            {
                var response = await _request.GetAsync($"https://student.husc.edu.vn/Subject/Details/{course}/");
                if (response.IsSuccessStatusCode)
                {
                    var content = _request.Content;
                    var htmlDoc = new HtmlDocument();
                    htmlDoc.LoadHtml(content);  // Load từ HTML string

                    var trinhdodaotao = htmlDoc.DocumentNode.SelectSingleNode("/html/body/div[2]/div[2]/div/div/div/fieldset[1]/div[5]/div/p");
                    if(trinhdodaotao != null)
                    {
                        var trinhDoDaoTao = WebUtility.HtmlDecode(trinhdodaotao.InnerText.Trim());
                        Console.WriteLine($"Trình độ đào tạo của khóa học {course}: {trinhDoDaoTao}");
                        // Cập nhật trình độ đào tạo cho khóa học
                        await _departmentServices.CreateAsync(new DepartmentCreateRequest
                        {
                            Name = trinhDoDaoTao,
                            Code = trinhDoDaoTao.Replace(" ", "_").ToUpper(),
                        });
                        var tenMon = htmlDoc.DocumentNode.SelectSingleNode("/html/body/div[2]/div[2]/div/div/div/fieldset[1]/div[1]/div/p");
                        if(tenMon != null)
                        {
                            var department = _department.Find(f => f.Name == trinhDoDaoTao);

                            var tenMonHoc = WebUtility.HtmlDecode(tenMon.InnerText.Trim());
                            var courseNew = _course.Find(f => f.Code == course.Trim());
                            if (courseNew == null)
                            {
                                Console.WriteLine($"Thêm môn {tenMonHoc} vào cơ sở dữ liệu");
                                await _courseServices.CreateAsync(new CourseCreateRequest
                                {
                                    Code = course.Trim(),
                                    Name = tenMonHoc,
                                    DepartmentId = department.Id
                                });
                                await UnitOfWork.CommitAsync();
                            }
                            else
                            {
                                Console.WriteLine($"Cập nhật {tenMonHoc} vào cơ sở dữ liệu");
                                courseNew.DepartmentId = department.Id;
                                courseNew.Department = department;
                                _course.Update(courseNew);
                                await UnitOfWork.CommitAsync();
                            }
                        }
                        else
                        {
                            Console.WriteLine($"Không tìm thấy tên môn học cho khóa học {course}.");
                        }
                    }
                    else
                    {
                        Console.WriteLine($"Không tìm thấy trình độ đào tạo cho khóa học {course}.");
                    }
                }
                else
                {
                    Console.WriteLine($"Lỗi khi lấy dữ liệu cho khóa học {course}: {response.ReasonPhrase}");
                }
            }
        }
    }
}
