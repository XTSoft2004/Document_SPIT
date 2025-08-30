using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DotNetEnv;
using HelperHttpClient;

namespace Domain.Common.HttpRequest
{
    public class HttpRequest
    {
        private static readonly RequestHttpClient _request;
        static HttpRequest()
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

            string? keyAPI = Environment.GetEnvironmentVariable("KEY_API");
            _request.SetAuthentication(keyAPI);

            string? apiServer = Environment.GetEnvironmentVariable("API_SERVER");
            if (!string.IsNullOrEmpty(apiServer))
                _request.SetAddress($"http://{apiServer}/");
        }
        public static string GetResponse(HttpResponseMessage httpResponseMessage)
        {
            return RequestHttpClient.GetTextContent(httpResponseMessage).GetAwaiter().GetResult();
        }
        public static RequestHttpClient _client => _request;
    }
}
