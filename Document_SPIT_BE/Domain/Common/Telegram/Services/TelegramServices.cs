using Domain.Base.Services;
using Domain.Common.Telegram.Interfaces;
using HelperHttpClient;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Common.Telegram.Services
{
    public class TelegramServices : BaseService, ITelegramServices
    {
        public TelegramServices() 
        {
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
        public async Task<bool> SendMessage(string message)
        {
            string BotToken = Environment.GetEnvironmentVariable("BOT_TOKEN");
            string ChatID = Environment.GetEnvironmentVariable("CHAT_ID");
            string Message_Thread_ID = Environment.GetEnvironmentVariable("MESSAGE_THREAD_ID");

            DateTime dateTime = DateTime.Now;
            string messageQuery = $"[{dateTime:dd-MM-yyyy HH:mm:ss}] {message}";

            RequestHttpClient _request = new RequestHttpClient();
            var response = await _request.GetAsync(
                $"https://api.telegram.org/bot{BotToken}/sendMessage?chat_id={ChatID}&message_thread_id={Message_Thread_ID}&text={Uri.EscapeDataString(messageQuery)}&parse_mode=HTML"
            );

            return response.IsSuccessStatusCode;
        }
    }
}
