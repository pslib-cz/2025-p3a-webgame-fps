namespace FPS_TCG.Server.Models
{
    public class Card
    {
        public required int CardId { get; set; }

        public required string Name { get; set; }

        public  int damage1 { get; set; }
        public int damage2 { get; set; }
        public int health { get; set; }
        public int shield { get; set; }
        public required int diceCost { get; set; }

    }
}
