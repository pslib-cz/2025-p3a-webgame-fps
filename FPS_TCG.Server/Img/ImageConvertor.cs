using System;
using System.IO;
using System.Threading.Tasks;
using FPS_TCG.Server.Models;

namespace FPS_TCG.Server.Data
{
    public static class ImageConvertor
    {
        public static byte[]? ConvertImageToByteArray(string imagePath)
        {
            if (string.IsNullOrWhiteSpace(imagePath))
                throw new ArgumentException("imagePath is null or empty", nameof(imagePath));

            if (File.Exists(imagePath))
            {
                return File.ReadAllBytes(imagePath);
            }

            return null;
        }


        public static async Task<ImageEntity?> SaveImageToDatabaseAsync(AppDbContext db, string imagePath, int? cardId = null)
        {
            if (db == null) throw new ArgumentNullException(nameof(db));
            if (string.IsNullOrWhiteSpace(imagePath)) throw new ArgumentException("imagePath is null or empty", nameof(imagePath));

            var bytes = ConvertImageToByteArray(imagePath);
            if (bytes == null) return null;

            var image = new ImageEntity
            {
                FileName = Path.GetFileName(imagePath),
                Data = bytes,
                CardId = cardId
            };

            db.Images.Add(image);
            await db.SaveChangesAsync().ConfigureAwait(false);

            return image;
        }
    }
}