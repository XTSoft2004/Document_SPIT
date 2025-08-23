using Domain.Base.Services;
using Domain.Common.ExceptionLogger.Interfaces;
using Domain.Common.Telegram.Interfaces;
using Domain.Common.Telegram.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Domain.Common.ExceptionLogger.Services
{
    public class ExceptionLoggerServices : BaseService, IExceptionLoggerServices
    {
        private readonly ITelegramServices telegramServices;

        public ExceptionLoggerServices(ITelegramServices telegramServices)
        {
            this.telegramServices = telegramServices;
        }

        public async Task LogExceptionAsync(Exception ex)
        {
            if (ex == null) return;

            var sb = new StringBuilder();

            sb.AppendLine("🔥 <b>Exception Occurred</b>");
            sb.AppendLine($"🕒 <b>Time</b>: {DateTime.Now:yyyy-MM-dd HH:mm:ss}");

            sb.AppendLine($"🏷️ <b>Type</b>: {EscapeForTelegram(ex.GetType().FullName)}");
            sb.AppendLine($"💬 <b>Message</b>: {EscapeForTelegram(ex.Message)}");

            if (ex.InnerException != null)
            {
                sb.AppendLine("⚠️ ---- <b>Inner Exception</b> ----");
                sb.AppendLine($"🏷️ <b>Type</b>: {EscapeForTelegram(ex.InnerException.GetType().FullName)}");
                sb.AppendLine($"💬 <b>Message</b>: {EscapeForTelegram(ex.InnerException.Message)}");
            }

            var st = new StackTrace(ex, true);
            var frames = st.GetFrames();
            if (frames != null && frames.Length > 0)
            {
                sb.AppendLine("📂 ---- <b>Stack Trace (Top 5)</b> ----");
                sb.AppendLine("<pre>");
                int index = 1;
                foreach (var frame in frames.Take(5))
                {
                    var method = frame.GetMethod();
                    var file = frame.GetFileName() ?? "N/A";
                    var line = frame.GetFileLineNumber();

                    sb.AppendLine($"{index}) {EscapeForTelegram(method?.DeclaringType?.FullName)}.{EscapeForTelegram(method?.Name)}");
                    sb.AppendLine($"    File: {EscapeForTelegram(file)}");
                    sb.AppendLine($"    Line: {line}");
                    sb.AppendLine();
                    index++;
                }
                sb.AppendLine("</pre>");
            }

            await telegramServices.SendMessage(sb.ToString(), "114");
        }
        private string EscapeForTelegram(string text)
        {
            if (string.IsNullOrEmpty(text)) return text;
            return text
                .Replace("&", "&amp;")
                .Replace("<", "&lt;")
                .Replace(">", "&gt;");
        }
    }
}
