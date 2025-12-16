namespace FPS_TCG.Server.Models
{
    public class CardDto
    {
        public int CardId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Health { get; set; }
        public int Shield { get; set; }
        public string Skill1Name { get; set; } = string.Empty;
        public int Skill1Damage { get; set; }
        public int Skill1Cost { get; set; }
        public string Skill2Name { get; set; } = string.Empty;
        public string? Skill2Effect { get; set; }
        public int Skill2Cost { get; set; }
        public int SupportCost { get; set; }
        public string SupportEffect { get; set; } = string.Empty;
        //public byte[]? ImageData { get; set; }
        //public string? ImageContentType { get; set; }

    }
}