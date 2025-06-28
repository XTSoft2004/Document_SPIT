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
            string cookie = "ASP.NET_SessionId=u5zhtrp41p1ih4ixwiej2exm;__RequestVerificationToken=ec4fdKKRryWLXSyYKdJLTTYxxlsDUsKJy4A61C0N2EwsD1yXkWl--G8f1qfjkwe2LvN8VAkhJKI6_GChwnkKCKf6yA41;UMS.StudentPortal.F5C0A1C9384C2E25E79BA1ABF5D9A037=21F3F1B7536AE59B456D7A7ACBBCACC3116EDF47F52E75D53065EF5ACEABA9BBB64D50169733D12495C898B7DDC0D1EE9AC8BEA52768FA047CF976FEAF26748A1CFF6BEB5CD4C52A41224490E74B9B558F37A13106FDCB8E28F4A3F4D76C311F4BCFEE70D89A0B405623EDC669B90A128785D20591499C30FD01830739589645431710AAFC2C1C87A2F85746410AA1A5C161EF772FD3E9738CE3EFB411075C43A8BD24D144A89DB3B3D193ABCA30A598795D74A2BE128755ADF002FBD238DF3297B8B37B7C589449E1BE0805BF405F0779CA8D6D7678858BD4AA8D38250A8B6F9C98ACBE029E844508655F13A1AFFB38FD23EB127A511942B93B4AC73E0334B344ADF2E4";
            RequestHttpClient _request = new RequestHttpClient();
            _request.SetCookie(cookie, "/", "student.husc.edu.vn");

            string[] courseId = File.ReadAllLines("D:\\Learn_HUSC\\CSharp\\Document_SPIT\\Document_SPIT_BE\\Document_SPIT_BE\\CourseList.txt");
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
                            //else
                            //{
                            //    Console.WriteLine($"Cập nhật {tenMonHoc} vào cơ sở dữ liệu");
                            //    courseNew.DepartmentId = department.Id;
                            //    courseNew.Department = department;
                            //    _course.Update(courseNew);
                            //    await UnitOfWork.CommitAsync();
                            //}
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
