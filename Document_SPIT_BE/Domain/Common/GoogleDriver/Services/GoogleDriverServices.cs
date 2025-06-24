using Domain.Base.Services;
using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.GoogleDriver.Model;
using Domain.Common.GoogleDriver.Model.Request;
using Domain.Common.GoogleDriver.Model.Response;
using Domain.Common.Http;
using HelperHttpClient;
using HelperHttpClient.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Sprache;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Domain.Common.GoogleDriver.Services
{
    public class GoogleDriverSevices : BaseService, IGoogleDriverServices
    {
        private readonly RequestHttpClient? _request;
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;
        public GoogleDriverSevices(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _request = new RequestHttpClient();
            _config = configuration;
            _httpClientFactory = httpClientFactory;
        }
        //public async Task<string> UploadImage(UploadFileRequest uploadFileRequest)
        //{
        //    var uploadResponse = await UploadFile(uploadFileRequest);
        //    if (uploadResponse != null)
        //    {
        //        //string thumbnailLink = await PreviewFile(uploadResponse);
        //        string urlFile = $"https://drive.google.com/thumbnail?id={uploadResponse.id}&sz=w1000";
        //        return urlFile;
        //    }
        //    return string.Empty;
        //}
        public async Task<string> GetThumbnailBase64(string fileId)
        {
            string accessToken = await GetAccessToken();
            var response = await _request.GetAsync($"https://www.googleapis.com/drive/v2/files/{fileId}");
            if (response.IsSuccessStatusCode)
            {
                string fileContent = _request.Content;
                var jsonData = JObject.Parse(fileContent);
                if (jsonData["thumbnailLink"] != null)
                {
                    string thumbnailLink = jsonData["thumbnailLink"].ToString();
                    thumbnailLink = thumbnailLink.Replace("=s220", "=s1920");
                    using var client = new HttpClient();
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    var imageResponse = await client.GetAsync(thumbnailLink);
                    if (imageResponse.IsSuccessStatusCode)
                    {
                        var imageBytes = await imageResponse.Content.ReadAsByteArrayAsync();
                        string base64String = Convert.ToBase64String(imageBytes);
                        return base64String;
                    }
                }
            }
            Console.WriteLine("❌ Lỗi khi lấy nội dung tệp tin hoặc thumbnail:");
            Console.WriteLine(await response.Content.ReadAsStringAsync());
            return string.Empty;
        }
        public async Task<UploadFileResponse> UploadFile(UploadFileBase64Request uploadFileRequest)
        {
            string accessToken = await GetAccessToken();
            string mimeType = AppDictionary.GetMimeTypeDriver(uploadFileRequest.FileName);

            var typeFile = uploadFileRequest.FileName.Split('.')[1];
            if (typeFile == "docx" || typeFile == "doc")
                mimeType = "application/vnd.google-apps.document";

            string metadataJson = $@"{{
                ""name"": ""{uploadFileRequest.FileName}"",
                ""parents"": [""{uploadFileRequest.FolderId}""],
                ""mimeType"": ""{mimeType}""
            }}";

            string boundary = "===MyCustomBoundary===";

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var multipartContent = new MultipartContent("related", boundary);
            multipartContent.Add(new StringContent(metadataJson, Encoding.UTF8, "application/json"));

            // Giải mã Base64 thành byte[]
            byte[] fileBytes = Convert.FromBase64String(uploadFileRequest.Base64String);

            var fileContent = new ByteArrayContent(fileBytes);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(mimeType);
            multipartContent.Add(fileContent);

            var response = await client.PostAsync(
                "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
                multipartContent
            );

            string responseText = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("✅ Upload thành công!");
                Console.WriteLine("📄 Response: " + responseText);

                var jsonData = System.Text.Json.JsonSerializer.Deserialize<UploadFileResponse>(responseText);
                return jsonData;
            }
            else
            {
                Console.WriteLine("❌ Upload thất bại:");
                Console.WriteLine(responseText);
                return null;
            }
        }
        private async Task CopyConvertDocs(UploadFileResponse uploadFileResponse)
        {
            await GetAccessToken();
            var jsonData = new Dictionary<string, string>
            {
                { "name", uploadFileResponse.name },
                { "mimeType", "application/vnd.google-apps.document" } // Chuyển đổi sang Google Docs
            };
            var response = await _request.PostAsync($"https://www.googleapis.com/drive/v3/files/{uploadFileResponse.id}/copy", jsonData);
            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("✅ Copy file thành công!");
                //var response_DELETE = await _request.DeleteAsync($"https://www.googleapis.com/drive/v3/files/${uploadFileResponse.id}");
            }
            else
            {
                Console.WriteLine("❌ Lỗi khi copy file:");
                Console.WriteLine(await response.Content.ReadAsStringAsync());
            }
        }
        public async Task<string> GetAccessToken()
        {
            TokenInfoGoogleResponse InfoToken = await GetInfoToken(TokenDriverStore.Access_Token);

            if (InfoToken == null || (InfoToken != null && Convert.ToInt32(InfoToken.exp) <= DateTimeOffset.UtcNow.ToUnixTimeSeconds()))
            {
                var JsonData = new Dictionary<string, string>
                {
                    { "client_id", _config["GoogleInfo:client_id"] },
                    { "client_secret", _config["GoogleInfo:client_secret"] },
                    { "refresh_token", _config["GoogleInfo:refresh_token"] },
                    { "grant_type", "refresh_token" }
                };
                var response = await _request.PostAsync("https://oauth2.googleapis.com/token", JsonData);
                if (response.IsSuccessStatusCode)
                {
                    string access_token = Regex.Match(_request.Content, "\"access_token\": \"(.*?)\"").Groups[1].Value;
                    TokenDriverStore.Access_Token = access_token;
                    _request.SetAuthentication(TokenDriverStore.Access_Token);
                    return access_token;
                }
            }
            return TokenDriverStore.Access_Token;
        }
        private async Task<TokenInfoGoogleResponse> GetInfoToken(string access_token)
        {
            if (string.IsNullOrEmpty(access_token))
                return null;
            var response = await _request.GetAsync($"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}");
            if (response.IsSuccessStatusCode)
            {
                var jsonData = JsonConvert.DeserializeObject<TokenInfoGoogleResponse>(_request.Content);
                return jsonData;
            }
            else
            {
                return null;
            }
        }
        private async Task<FileInfoResponse?> GetInfoById(string id)
        {
            await GetAccessToken();
            var response = await _request.GetAsync($"https://www.googleapis.com/drive/v3/files/{id}?fields=id,name,mimeType,webContentLink,webViewLink,thumbnailLink");
            if (response.IsSuccessStatusCode)
            {
                var result = _request.Content;
                var fileInfo = JsonConvert.DeserializeObject<FileInfoResponse?>(result);
                return fileInfo;
            }
            return null;
        }
        public async Task<(byte[] Data, string ContentType, string FileName)?> GetGoogleDrivePreviewAsync(string fileId)
        {
            if (string.IsNullOrWhiteSpace(fileId))
                return null;

            var infoFile = await GetInfoById(fileId);
            if (infoFile == null || string.IsNullOrWhiteSpace(infoFile.name))
                return null;

            var client = _httpClientFactory.CreateClient();

            // Tạo link preview nếu là docx thì sẽ gọi preview riêng
            var googleDriveUrl = $"https://www.googleapis.com/drive/v3/files/{fileId}?alt=media";
            if (infoFile.mimeType.Contains("application/vnd.google-apps"))
                googleDriveUrl = $"https://www.googleapis.com/drive/v3/files/{fileId}/export?mimeType=application/pdf";

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", TokenDriverStore.Access_Token);
            var response = await client.GetAsync(googleDriveUrl);
            if (!response.IsSuccessStatusCode)
                return null;

            // Lấy Content-Type từ header
            var contentType = response.Content.Headers.ContentType?.MediaType;

            // Nếu không rõ hoặc là "application/octet-stream", đoán theo đuôi file
            if (string.IsNullOrWhiteSpace(contentType) || contentType == "application/octet-stream")
            {
                // Tự động lấy contentType
                var ext = Path.GetExtension(infoFile.name)?.ToLower();
                contentType = AppDictionary.GetMimeTypeDriver($"a{ext}");
            }

            var bytes = await response.Content.ReadAsByteArrayAsync();

            return (bytes, contentType, infoFile.name);
        }
        public async Task<List<DriverItemResponse?>?> GetInfoFolder(string folderId, bool isOnlyFolder = false)
        {
            await GetAccessToken();
            var response = await _request.GetAsync($"https://www.googleapis.com/drive/v3/files?q='{folderId}'+in+parents&fields=files(id,name,webViewLink,webContentLink,createdTime,md5Checksum)&orderBy=createdTime");
            if (response.IsSuccessStatusCode)
            {
                var result = _request.Content;
                var jsonData = JObject.Parse(result)?["files"];
                if (jsonData != null)
                {
                    var fileInfo = JsonConvert.DeserializeObject<List<DriverItemResponse?>?>(jsonData.ToString());

                    if (isOnlyFolder)
                        fileInfo = fileInfo?.Where(f => f?.IsFolder == true).ToList();

                    return fileInfo;
                }
            }
            return null;
        }
        public async Task<HttpResponse> CreateFolder(string folderName, string parentId = "")
        {
            var listFolder = await GetInfoFolder(parentId, true);
            if (listFolder != null && listFolder.Any(f => f?.Name == folderName && f?.IsFolder == true))
                return HttpResponse.Error("Thư mục đã tồn tại trong Google Drive.");

            var jsonData = new
            {
                name = folderName,
                mimeType = "application/vnd.google-apps.folder",
                parents = string.IsNullOrEmpty(parentId) ? new string[] { } : new[] { parentId }
            };

            var response = await _request.PostAsync($"https://www.googleapis.com/drive/v3/files", jsonData);
            if (response.IsSuccessStatusCode)
                return HttpResponse.OK("Tạo thư mục thành công.");

            return HttpResponse.Error("Lỗi khi tạo thư mục trong Google Drive.");
        }
        public async Task<InfoGoogleDriverResponse?> GetInfoGoogleDriver()
        {
            await GetAccessToken();
            var response = await _request.GetAsync("https://www.googleapis.com/drive/v3/about?fields=user,storageQuota");
            if (response.IsSuccessStatusCode)
            {
                var result = _request.Content;
                var info = JObject.Parse(result);
                if (info != null)
                {
                    var storageQuota = info["storageQuota"];
                    if (storageQuota != null)
                    {
                        var limit = storageQuota["limit"]?.Value<double>() ?? 0;
                        var usage = storageQuota["usage"]?.Value<double>() ?? 0;
                        return new InfoGoogleDriverResponse
                        {
                            limit = Math.Round(limit / Math.Pow(1024, 3), 2) - Math.Round(usage / Math.Pow(1024, 3), 2),
                            usage = Math.Round(usage / Math.Pow(1024, 3), 2)
                        };
                    }
                }
            }
            return null;
        }
        // Trả về toan bo file/folder tu ngoai vao trong
        public async Task<List<DriveFileItem>> GetAllDriveItems()
        {
            var files = new List<DriveFileItem>();
            string? nextPageToken = null;

            do
            {
                var url = $"https://www.googleapis.com/drive/v3/files?pageSize=1000" +
                          $"&fields=nextPageToken, files(id,name,mimeType,parents)" +
                          (!string.IsNullOrEmpty(nextPageToken) ? $"&pageToken={nextPageToken}" : "");

                var response = await _request.GetAsync(url);
                var content = JObject.Parse(_request.Content);

                var items = JsonConvert.DeserializeObject<List<DriveFileItem>>(content["files"]?.ToString() ?? "[]");
                if (items != null) files.AddRange(items);

                nextPageToken = content["nextPageToken"]?.ToString();
            } while (!string.IsNullOrEmpty(nextPageToken));

            return files;
        }
        public List<TreeDocumentResponse> BuildDriveTree(List<DriveFileItem> allItems, string rootFolderId)
        {
            var treeMap = allItems.ToDictionary(
                item => item.Id,
                item => new TreeDocumentResponse
                {
                    Name = item.Name,
                    FolderId = item.Id,
                    IsFolder = item.MimeType == "application/vnd.google-apps.folder",
                    Children = new List<TreeDocumentResponse>()
                }
            );

            var roots = new List<TreeDocumentResponse>();

            foreach (var item in allItems)
            {
                if (item.Parents != null && item.Parents.Count > 0)
                    {
                    var parentId = item.Parents[0];
                    if (treeMap.ContainsKey(parentId))
                        treeMap[parentId].Children.Add(treeMap[item.Id]);
                }

                if (item.Id == rootFolderId)
                    roots.Add(treeMap[item.Id]);
            }

            return roots.Select(r => treeMap[r.FolderId!]).ToList();
        }
        public async Task<List<TreeDocumentResponse>> GetTreeDocument(string rootFolderId)
        {
            await GetAccessToken();
            var allItems = await GetAllDriveItems();
            return BuildDriveTree(allItems, rootFolderId);
        }
        public async Task<List<DriverItemResponse?>?> GetOnlyFolder(string folderId)
        {
            await GetAccessToken();
            var response = await _request.GetAsync(
                $"https://www.googleapis.com/drive/v3/files?q='{folderId}'+in+parents&fields=files(id,name,webViewLink,webContentLink,createdTime,md5Checksum,mimeType)&orderBy=createdTime"
            );
            var result = _request.Content;
            var jsonData = JObject.Parse(result)?["files"];
            if (jsonData != null)
            {
                var filesInfo = JsonConvert.DeserializeObject<List<DriverItemResponse>>(jsonData.ToString());
                var folders = filesInfo
                    .Where(file => file.IsFolder)
                    .ToList();

                foreach (var file in folders)
                    file.parentId = folderId;

                return folders;
            }
            return null;
        }
    }
}
