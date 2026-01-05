using System;
using System.IO;
using System.Linq;

namespace FPS_TCG.Server.Img
{
    public static class ImageConvertor
    {
        // Hledani podle jmena (např. "Bleh")
        // Vrátí (bytes, contentType, fileName) nebo (null,null,null) pokud nenalezeno.
        public static (byte[]? Data, string? ContentType, string? FileName) LoadImageBytesFromFolder(string folderPath, string baseName)
        {
            if (string.IsNullOrWhiteSpace(folderPath) || string.IsNullOrWhiteSpace(baseName))
                return (null, null, null);

            if (!Directory.Exists(folderPath))
                return (null, null, null);

            var exts = new[] { ".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp" };

            // case-insensitive
            var found = Directory.EnumerateFiles(folderPath)
                .FirstOrDefault(f => string.Equals(Path.GetFileNameWithoutExtension(f), baseName, StringComparison.OrdinalIgnoreCase));

            if (found == null)
            {
                foreach (var ext in exts)
                {
                    var candidate = Path.Combine(folderPath, baseName + ext);
                    if (File.Exists(candidate))
                    {
                        found = candidate;
                        break;
                    }
                }
            }

            if (found == null)
            {
                found = Directory.EnumerateFiles(folderPath)
                    .FirstOrDefault(f => Path.GetFileName(f).IndexOf(baseName, StringComparison.OrdinalIgnoreCase) >= 0);
            }

            if (found == null)
                return (null, null, null);

            var bytes = File.ReadAllBytes(found);
            var contentType = GetContentTypeByExtension(Path.GetExtension(found));
            return (bytes, contentType, Path.GetFileName(found));
        }

        private static string? GetContentTypeByExtension(string? ext)
        {
            if (string.IsNullOrEmpty(ext)) return null;
            ext = ext.ToLowerInvariant();
            return ext switch
            {
                ".png" => "image/png",
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".gif" => "image/gif",
                ".webp" => "image/webp",
                ".bmp" => "image/bmp",
                _ => "application/octet-stream"
            };
        }
    }
}