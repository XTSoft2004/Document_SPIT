using Domain.Common.Gemini.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.Gemini.Interfaces
{
    public interface IGeminiServices
    {
        /// <summary>
        /// Kiểm tra nội dung của file có phải là nội dung độc hại hay không
        /// </summary>
        /// <param name="uploadFile"></param>
        /// <returns></returns>
        Task<bool> GeminiCheck(UploadFileGeminiCheckRequest uploadFile);
    }
}
