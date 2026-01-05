using System;
using System.IO;
using System.Linq;

namespace FPS_TCG.Server.Img
{
    public static class ImageConvertor
    {
        private static readonly string[] SupportedExtensions = new[] { ".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp" };

        public static (byte[]? Data, string? ContentType, string? FileName) LoadImageBytesFromFolder(string folderPath, string baseName)
        {
            if (string.IsNullOrWhiteSpace(folderPath) || string.IsNullOrWhiteSpace(baseName))
                return (null, null, null);

            if (!Directory.Exists(folderPath))
                return (null, null, null);

            var found = Directory.EnumerateFiles(folderPath)
                .FirstOrDefault(f => string.Equals(Path.GetFileNameWithoutExtension(f), baseName, StringComparison.OrdinalIgnoreCase));

            if (found == null)
            {
                foreach (var ext in SupportedExtensions)
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

        public static (byte[]? Data, string? ContentType, string? FileName) LoadImageFromPath(string filePath)
        {
            if (string.IsNullOrWhiteSpace(filePath))
                return (null, null, null);

            if (!File.Exists(filePath))
                return (null, null, null);

            try
            {
                var bytes = File.ReadAllBytes(filePath);
                var contentType = GetContentTypeByExtension(Path.GetExtension(filePath));
                return (bytes, contentType, Path.GetFileName(filePath));
            }
            catch
            {
                return (null, null, null);
            }
        }

        public static (byte[]? Data, string? ContentType, string? FileName) LoadImageFromImagesToConvert(string imageNameOrFileName)
        {
            if (string.IsNullOrWhiteSpace(imageNameOrFileName))
                return (null, null, null);

            const string folderName = "ImageToConvert"; //folder name change skib

            var result = ImageConvertor.LoadImageFromImagesToConvert("blehcat.png"); //skib zmena toho obrazku na convvert 

            var candidateFolders = new[]
            {
                Path.Combine(Directory.GetCurrentDirectory(), folderName),
                Path.Combine(AppContext.BaseDirectory ?? string.Empty, folderName),
                folderName,
            };

            string? actualFolder = candidateFolders.FirstOrDefault(Directory.Exists);
            if (actualFolder == null)
                return (null, null, null);

            if (Path.HasExtension(imageNameOrFileName))
            {
                var foundExact = Directory.EnumerateFiles(actualFolder)
                    .FirstOrDefault(f => string.Equals(Path.GetFileName(f), imageNameOrFileName, StringComparison.OrdinalIgnoreCase));

                if (foundExact != null)
                    return LoadImageFromPath(foundExact);

                var combined = Path.Combine(actualFolder, imageNameOrFileName);
                if (File.Exists(combined))
                    return LoadImageFromPath(combined);

                return (null, null, null);
            }

            var pngCandidate = Directory.EnumerateFiles(actualFolder)
                .FirstOrDefault(f => string.Equals(Path.GetFileNameWithoutExtension(f), imageNameOrFileName, StringComparison.OrdinalIgnoreCase) &&
                                      string.Equals(Path.GetExtension(f), ".png", StringComparison.OrdinalIgnoreCase));
            if (pngCandidate != null)
                return LoadImageFromPath(pngCandidate);

            foreach (var ext in SupportedExtensions)
            {
                var candidate = Directory.EnumerateFiles(actualFolder)
                    .FirstOrDefault(f => string.Equals(Path.GetFileNameWithoutExtension(f), imageNameOrFileName, StringComparison.OrdinalIgnoreCase) &&
                                         string.Equals(Path.GetExtension(f), ext, StringComparison.OrdinalIgnoreCase));
                if (candidate != null)
                    return LoadImageFromPath(candidate);
            }
            var partial = Directory.EnumerateFiles(actualFolder)
                .FirstOrDefault(f => Path.GetFileName(f).IndexOf(imageNameOrFileName, StringComparison.OrdinalIgnoreCase) >= 0);
            if (partial != null)
                return LoadImageFromPath(partial);

            return LoadImageBytesFromFolder(actualFolder, imageNameOrFileName);
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
