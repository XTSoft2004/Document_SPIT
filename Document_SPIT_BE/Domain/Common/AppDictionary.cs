using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Domain.Common
{
    public class AppDictionary
    {
        public static readonly Dictionary<string, string> MimeTypes = new()
        {
            // 📝 Text
            { ".txt", "text/plain" },
            { ".md", "text/markdown" },
            { ".csv", "text/csv" },
            { ".tsv", "text/tab-separated-values" },
            { ".xml", "application/xml" },
            { ".json", "application/json" },
            { ".rtf", "application/rtf" },

            // 📄 PDF
            { ".pdf", "application/pdf" },

            // 📄 Microsoft Word
            { ".doc", "application/msword" },
            { ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },

            // 📊 Microsoft Excel
            { ".xls", "application/vnd.ms-excel" },
            { ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },

            // 📈 Microsoft PowerPoint
            { ".ppt", "application/vnd.ms-powerpoint" },
            { ".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation" },

            // 🔃 OpenDocument Formats (LibreOffice / OpenOffice)
            { ".odt", "application/vnd.oasis.opendocument.text" },
            { ".ods", "application/vnd.oasis.opendocument.spreadsheet" },
            { ".odp", "application/vnd.oasis.opendocument.presentation" },

            // 📚 EPUB eBook
            { ".epub", "application/epub+zip" },

            // 🗜️ Compressed archives (có thể chứa tài liệu)
            { ".zip", "application/zip" },
            { ".rar", "application/vnd.rar" },
            { ".7z", "application/x-7z-compressed" },

            // ✅ Fallback
            { ".bin", "application/octet-stream" },

            // 🖼️ Images
            { ".jpg", "image/jpeg" },
            { ".jpeg", "image/jpeg" },
            { ".png", "image/png" },
            { ".gif", "image/gif" },
            { ".bmp", "image/bmp" },
            { ".webp", "image/webp" },
            { ".tiff", "image/tiff" },
            { ".tif", "image/tiff" },
            { ".svg", "image/svg+xml" },
            { ".ico", "image/x-icon" },
        };
        public static string GetMimeTypeDriver(string fileName)
        {
            string extension = Path.GetExtension(fileName).ToLowerInvariant();
            return MimeTypes.TryGetValue(extension, out var mime) ? mime : "application/octet-stream";
        }

        public static string GetMimeTypeFromBase64(string base64)
        {
            // Ví dụ: data:image/jpeg;base64,...
            var match = Regex.Match(base64, @"^data:(?<mime>.+?);base64");
            if (match.Success)
            {
                return match.Groups["mime"].Value;
            }
            return null;
        }
        public static string? GetExtensionFromMimeType(string mimeType)
        {
            if (string.IsNullOrWhiteSpace(mimeType))
                return null;

            // Find the first extension that matches the given mimeType
            foreach (var kvp in MimeTypes)
            {
                if (string.Equals(kvp.Value, mimeType, StringComparison.OrdinalIgnoreCase))
                {
                    return kvp.Key;
                }
            }
            return string.Empty;
        }
    }
}
