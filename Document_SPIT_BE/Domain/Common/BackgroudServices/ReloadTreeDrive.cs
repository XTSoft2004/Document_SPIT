using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.GoogleDriver.Model;
using Domain.Common.GoogleDriver.Model.Response;
using Domain.Entities;
using Domain.Interfaces.Database;
using Domain.Interfaces.Repositories;
using HelperHttpClient;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Domain.Common.BackgroudServices
{
    public class ReloadTreeDrive : BackgroundService
    {
        private readonly ILogger<ReloadTreeDrive>? _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private bool _isRunning = false;
        private readonly RequestHttpClient _request;
        public ReloadTreeDrive(
            ILogger<ReloadTreeDrive>? logger,
            IServiceScopeFactory scopeFactory)
        {
            _request = new RequestHttpClient();
            _logger = logger;
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var timer = new PeriodicTimer(TimeSpan.FromSeconds(15));
            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                await _time_Callback(null);
            }
        }
        public static List<DriveFileItem> listFileDrive = new List<DriveFileItem>();
        public async Task _time_Callback(object? state)
        {
            if (_isRunning) return;
            _isRunning = true;
            AppExtension.PrintWithRandomColor("Bắt đầu tải lại danh sách file từ Google Drive...");
            var files = new List<DriveFileItem>();
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var _document = scope.ServiceProvider.GetRequiredService<IRepositoryBase<Document>>();
                var _detailDocument = scope.ServiceProvider.GetRequiredService<IRepositoryBase<DetailDocument>>();
                scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
                string? nextPageToken = null;

                await GetAccessToken(); // Lấy access token nếu cần thiết
                _request.SetAuthentication(TokenDriverStore.Access_Token);

                do
                {
                    var url = $"https://www.googleapis.com/drive/v3/files?pageSize=1000" +
                              $"&fields=nextPageToken, files(id,name,mimeType,parents)" +
                              (!string.IsNullOrEmpty(nextPageToken) ? $"&pageToken={nextPageToken}" : "");

                    var response = await _request.GetAsync(url);
                    var content = JObject.Parse(_request.Content);

                    var items = JsonConvert.DeserializeObject<List<DriveFileItem>>(content["files"]?.ToString() ?? "[]");
                    if (items != null)
                    {
                        var documentDict = _document.All()
                            .Select(s => new
                            {
                                s.FileId,
                                s.Name,
                            }).ToList(); // Map FileId -> Name

                        var itemIndexExists = items
                           .Select((item, index) => new { item, index })
                           .Where(x => documentDict.Select(s => s.FileId).Contains(x.item.Id))
                           .Select(x => new
                           {
                               Id = x.item.Id,
                               Index = x.index
                           })
                           .ToList();

                        for (int i = itemIndexExists.Count - 1; i >= 0; i--)
                        {
                            var match = itemIndexExists[i];
                            var index = match.Index;
                            var item = items[index];
                            var document = _document.Find(d => d.FileId == item.Id);

                            if (document != null)
                            {
                                if (document.IsPrivate == true)
                                {
                                    items.RemoveAt(index);
                                    continue;
                                }

                                string? typeFile = Path.GetExtension(item.Name)?.TrimStart('.');
                                item.DocumentId = document.Id;
                                item.Name = $"{document.Name}.{typeFile}";

                                var detailDocument = _detailDocument.Find(dd => dd.Id == document.DetaiDocumentId);
                                if (detailDocument != null)
                                {
                                    item.TotalViews = detailDocument.TotalView;
                                    item.TotalDownloads = detailDocument.TotalDownload;
                                }
                            }
                        }
                        files.AddRange(items);
                    }

                    nextPageToken = content["nextPageToken"]?.ToString();
                } while (!string.IsNullOrEmpty(nextPageToken));
            }
            catch (Exception ex)
            {
                AppExtension.PrintWithRandomColor($"Lỗi khi kiểm tra lớp học sắp kết thúc: {ex.Message}"); // In ra thông báo lỗi với màu ngẫu nhiên
            }
            finally
            {
                listFileDrive = files;
                _isRunning = false;
                AppExtension.PrintWithRandomColor($"Đã tải lại danh sách file từ Google Drive, tổng số file: {files.Count}"); // In ra thông báo lỗi với màu ngẫu nhiên
            }
        }
        public async Task<string> GetAccessToken()
        {
            using var scope = _scopeFactory.CreateScope();
            IConfiguration _config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
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
    }
}
