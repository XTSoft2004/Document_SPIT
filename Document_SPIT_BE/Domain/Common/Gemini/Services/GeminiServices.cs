using Domain.Base.Services;
using Domain.Common.Gemini.Interfaces;
using Domain.Common.Gemini.Models;
using HelperHttpClient;
using Microsoft.VisualBasic;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.Gemini.Services
{
    public class GeminiServices : BaseService, IGeminiServices
    {
        private readonly RequestHttpClient _request;

        public GeminiServices()
        {
            _request = new RequestHttpClient();
            var manualPath = Environment.GetEnvironmentVariable("DOTNET_ENV_PATH");
            if (!string.IsNullOrEmpty(manualPath) && File.Exists(manualPath))
            {
                DotNetEnv.Env.Load(manualPath);
            }
            else
            {
                var envPath = Path.Combine(Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).Parent.Parent.Parent.Parent.FullName, ".env");
                DotNetEnv.Env.Load(envPath);
            }
        }

        public async Task<bool> GeminiCheck(UploadFileGeminiCheckRequest uploadFile)
        {
            var requestBody = new
            {
                contents = new[]
                {
                   new
                   {
                       parts = new object[]
                       {
                            new { text = "Hãy phân tích file/ảnh sau đây và xác định liệu nó có chứa nội dung độc hại hoặc không lành mạnh không (ví dụ: web giả mạo, bạo lực, khiêu dâm, cờ bạc, tài liệu lừa đảo, hoặc không phù hợp với mục đích học tập). Hãy tập trung kiểm tra:\r\n\r\nTên miền nếu có chứa link (ví dụ: trang web có phải là trang đáng tin cậy không?)\r\n\r\nNội dung văn bản (có chứa thông tin sai lệch, quảng cáo lừa đảo hay nội dung kích động không?)\r\n\r\nHình ảnh nếu có (có mang tính phản cảm, khiêu dâm, bạo lực hay mang nội dung dụ dỗ không?)\r\n\r\nChỉ trả lời: “Có” hoặc “Không”. Không cần giải thích thêm." },
                            new
                            {
                                inlineData = new
                                {
                                    mimeType = uploadFile.mineType,
                                    data = uploadFile.base64File
                                }
                            }
                        }
                    }
                }
            };


            string API_KEY_GEMINI = Environment.GetEnvironmentVariable("API_KEY_GEMINI");
            var response = await _request.PostAsync($"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={API_KEY_GEMINI}", requestBody); 
            if(!response.IsSuccessStatusCode)
            {
                var jsonResponse = JObject.Parse(_request.Content);
                string? result = jsonResponse["candidates"]?[0]?["content"]?["part"]?[0]?["text"]?.ToString();
                if (!String.IsNullOrEmpty(result) && result.ToLower().Contains("Có"))
                    return true;
                else
                    return false;
            }
            return await Task.FromResult(true);
        }
    }
}
