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
            DotNetEnv.Env.Load(".env");
            string keyAPI = Environment.GetEnvironmentVariable("KEY_API");
            _request.SetAuthentication(keyAPI);

            string apiServer = Environment.GetEnvironmentVariable("API_SERVER");
            if (!string.IsNullOrEmpty(apiServer))
                _request.SetAddress($"http://{apiServer}/");
        }
        public static RequestHttpClient Client => _request;
    }
}
