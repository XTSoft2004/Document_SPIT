using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Domain.Common
{
    public class AppExtension
    {
        public static string GetMd5FromBase64(string base64String)
        {
            // Giải mã base64 thành byte[]
            byte[] fileBytes = Convert.FromBase64String(base64String);

            // Tính MD5
            using (var md5 = MD5.Create())
            {
                byte[] hash = md5.ComputeHash(fileBytes);
                return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
            }
        }
        public static bool IsBase64String(string base64)
        {
            if (string.IsNullOrWhiteSpace(base64))
                return false;

            try
            {
                // Thử decode
                Convert.FromBase64String(base64);
                return true;
            }
            catch
            {
                return false;
            }
        }

    }
}
