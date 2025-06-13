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
            _request.SetAuthentication("Document_SPIT_19082023");

            DotNetEnv.Env.Load();

            // Lấy tất cả biến môi trường
            var envVars = Environment.GetEnvironmentVariables();
            foreach (System.Collections.DictionaryEntry entry in envVars)
            {
                Console.WriteLine($"{entry.Key} = {entry.Value}");
            }
            string apiServer = Environment.GetEnvironmentVariable("DB_PASSWORD");
            if (!string.IsNullOrEmpty(apiServer))
                _request.SetAddress($"http://{apiServer}/");
        }
        public static RequestHttpClient Client => _request;
    }
}
