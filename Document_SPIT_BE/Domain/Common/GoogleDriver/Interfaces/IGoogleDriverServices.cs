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
        Task<string> PreviewFile(string fileId);
        Task<(byte[] Data, string ContentType, string FileName)?> GetGoogleDrivePreviewAsync(string fileId);
    }
}
