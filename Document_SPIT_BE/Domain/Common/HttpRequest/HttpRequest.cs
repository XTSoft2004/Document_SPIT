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
            var envPath = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).Parent.Parent.Parent.FullName, ".env");
            DotNetEnv.Env.Load(envPath);

            string? keyAPI = Environment.GetEnvironmentVariable("KEY_API");
            _request.SetAuthentication(keyAPI);

            string? apiServer = Environment.GetEnvironmentVariable("API_SERVER");
            if (!string.IsNullOrEmpty(apiServer))
                _request.SetAddress($"http://{apiServer}/");
        }
        public static string GetResponse(HttpResponseMessage httpResponseMessage)
        {
            return RequestHttpClient.GetTextContent(httpResponseMessage).Result;
        }
        public static RequestHttpClient _client => _request;
    }
}
