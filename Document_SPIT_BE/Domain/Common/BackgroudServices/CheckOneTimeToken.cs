using Domain.Entities;
using Domain.Interfaces.Database;
using Domain.Interfaces.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.BackgroudServices
{
    public class CheckOneTimeToken : BackgroundService
    {
        private readonly ILogger<CheckOneTimeToken>? _logger;
        private readonly IServiceScopeFactory _scopeFactory;

        private bool _isRunning = false;

        public CheckOneTimeToken(
            ILogger<CheckOneTimeToken>? logger,
            IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var timer = new PeriodicTimer(TimeSpan.FromSeconds(10));
            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                await _time_Callback(null);
            }
        }
        public async Task _time_Callback(object? state)
        {
            if (_isRunning) return;
            _isRunning = true;
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var oneTimeTokenRepo = scope.ServiceProvider.GetRequiredService<IRepositoryBase<OneTimeToken>>();
                var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
                var now = DateTime.UtcNow;
                var oneTimeTokens = oneTimeTokenRepo.ListBy(
                    x => x.CreatedDate.AddSeconds(30) <= now
                ).ToList();
                oneTimeTokenRepo.DeleteRange(oneTimeTokens);
                await unitOfWork.CommitAsync();
                AppExtension.PrintWithRandomColor($"Đã xoá {oneTimeTokens.Count} token xem trước file bị hết hạn!"); // In ra thông báo lỗi với màu ngẫu nhiên
            }
            catch (Exception ex)
            {
                AppExtension.PrintWithRandomColor($"Lỗi khi kiểm tra lớp học sắp kết thúc: {ex.Message}"); // In ra thông báo lỗi với màu ngẫu nhiên
            }
            finally
            {
                _isRunning = false;
            }
        }

    }
}
