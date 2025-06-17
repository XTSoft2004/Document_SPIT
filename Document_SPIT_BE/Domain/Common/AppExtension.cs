using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Domain.Common
{
    public class AppExtension
    {
        public static string GetFileNameFromDataUri(string base64DataUri)
        {
            var match = Regex.Match(base64DataUri, @"name=([^;]+)");
            return match.Success ? match.Groups[1].Value : null;
        }
    }
}
