using Domain.Common.GoogleDriver.Model.Request;
using Domain.Common.GoogleDriver.Model.Response;
using Domain.Common.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Domain.Common.GoogleDriver.Services.GoogleDriverSevices;

namespace Domain.Common.GoogleDriver.Interfaces
{
    public interface IGoogleDriverServices
    {
        /// <summary>
        /// Tải lên file lên Google Drive
        /// </summary>
        /// <param name="uploadFileRequest"></param>
        /// <returns></returns>
        Task<UploadFileResponse> UploadFile(UploadFileBase64Request uploadFileRequest);
        /// <summary>
        /// Lấy access token để thực hiện các thao tác với Google Drive
        /// </summary>
        /// <returns></returns>
        Task<string> GetAccessToken();
        /// <summary>
        /// Preview file từ Google Drive
        /// </summary>
        /// <param name="fileId"></param>
        /// <returns></returns>
        Task<(byte[] Data, string ContentType, string FileName)?> GetGoogleDrivePreviewAsync(string fileId);
        /// <summary>
        /// Lấy dữ liệu trong folder, lấy các thông tin file và folder
        /// </summary>
        /// <param name="folderId"></param>
        /// <returns></returns>
        Task<List<DriverItemResponse?>?> GetInfoFolder(string folderId, bool isOnlyFolder = false);
        /// <summary>
        /// Lấy mẫu thumbnail của file
        /// </summary>
        /// <param name="fileId"></param>
        /// <returns></returns>
        Task<string> GetThumbnailBase64(string fileId);
        /// <summary>
        /// Lấy thông tin của Google Driver, bao gồm tên, email, quota, v.v.
        /// </summary>
        /// <returns></returns>
        Task<InfoGoogleDriverResponse?> GetInfoGoogleDriver();
        /// <summary>
        /// Tạo một thư mục mới trong Google Drive
        /// </summary>
        /// <param name="folderName"></param>
        /// <param name="parentId"></param>
        /// <returns></returns>
        Task<HttpResponse> CreateFolder(string folderName, string parentId = "");
        /// Trả về cây tài liệu
        /// </summary>
        /// <param name="folderId"></param>
        /// <returns></returns>
        Task<List<TreeDocumentResponse>> GetTreeDocument(string folderId);
        /// <summary>
        /// Trả về folder của folderId
        /// </summary>
        /// <param name="folderId"></param>
        /// <returns></returns>
        Task<List<DriverItemResponse?>?> GetOnlyFolder(string folderId);
    }
}
