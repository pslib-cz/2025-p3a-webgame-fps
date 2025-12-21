namespace FPS_TCG.Server.Models
{
    public class ImageEntity
    {
        public int ImageEntityId { get; set; }

        public required string FileName { get; set; }

        public required byte[] Data { get; set; }

        public int? CardId { get; set; }
        public Card? Card { get; set; }
    }
}