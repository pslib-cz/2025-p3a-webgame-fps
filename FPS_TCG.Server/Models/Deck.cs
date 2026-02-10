using System.Collections.Generic;

namespace FPS_TCG.Server.Models
{
    public class Deck
    {
        public required int DeckId { get; set; }

        public required string Name { get; set; }

        public List<Card> Cards { get; set; } = new();
    }
}