using Domain.Base.Services;
using Domain.Common;
using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.GoogleDriver.Model.Response;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Domain.Model.Request.Document;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services
{
    public class ExtensionServices : BaseService, IExtensionServices
    {
        private readonly IGoogleDriverServices _googleDriverServices;
        private readonly IDocumentServices _documentServices;
        private readonly IRepositoryBase<User> _user;
        private readonly IRepositoryBase<Document> _document;
        public ExtensionServices(IGoogleDriverServices googleDriverServices, IDocumentServices documentServices, IRepositoryBase<User> user, IRepositoryBase<Document> document)
        {
            _googleDriverServices = googleDriverServices;
            _documentServices = documentServices;
            _user = user;
            _document = document;
        }

        public async Task LoadFolderDriver(string folderId)
        {
            var userAdmin = _user.Find(f => f.Username == "admin"); 
            List<DriverItemResponse?> itemsInfo = await _googleDriverServices.GetInfoFolder(folderId);
            foreach (DriverItemResponse item in itemsInfo)
            {
                if(item == null)
                    continue;

                if (!item.IsFolder)
                {
                    Console.WriteLine($"Tạo mới tài liệu: {item.Name} - {item.Id}");
                    _document.Insert(new Document
                    {
                        Name = item.Name,
                        FileId = item.Id,
                        Md5Checksum = item.Md5Checksum ?? string.Empty,
                        IsPrivate = false, // Mặc định là công khai
                        StatusDocument = StatusDocument_Enum.Approved,
                        UserId = userAdmin?.Id ?? 0, // Gán người dùng admin
                        User = userAdmin,
                        FolderId = folderId,
                        CreatedDate = DateTime.Now
                    });
                    await UnitOfWork.CommitAsync();
                }
                else
                {
                    Console.WriteLine($"Tạo mới thư mục: {item.Name} - {item.Id}");
                    await LoadFolderDriver(item.Id);
                }    
            }
        }
    }
}
