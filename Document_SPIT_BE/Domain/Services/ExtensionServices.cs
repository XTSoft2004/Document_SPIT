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
        private readonly IRepositoryBase<DetailDocument> _detailDocument;
        private readonly IRepositoryBase<User> _user;
        private readonly IRepositoryBase<Document> _document;
        public ExtensionServices(IGoogleDriverServices googleDriverServices, IDocumentServices documentServices, IRepositoryBase<User> user, IRepositoryBase<Document> document, IRepositoryBase<DetailDocument> detailDocument)
        {
            _googleDriverServices = googleDriverServices;
            _documentServices = documentServices;
            _user = user;
            _document = document;
            _detailDocument = detailDocument;
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
                    // Tạo mới tài liệu từ Google Drive
                    var documentCreate = new Document
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
    }
}
