namespace FPS_TCG.Server.Models
{
    public class DeckCreateDto
    {
        public required string Name { get; set; }
        public required List<int> CardIds { get; set; } = new();
    }
}