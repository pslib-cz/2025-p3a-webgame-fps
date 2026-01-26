using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace FPS_TCG.Server.Models
{
    public class Card
    {
        public required int CardId { get; set; }

        public required string Name { get; set; }

        public required string type { get; set; }

        public int health { get; set; }
        public int shield { get; set; }

        public required string Skill1Name { get; set; }
        public int Skill1Damage { get; set; }
        public required int Skill1Cost { get; set; }

        public required string Skill2Name { get; set; }
        public required string skill2Effect { get; set; }
        public required int Skill2Damage { get; set; }
        public required int Skill2Cost { get; set; }

        public int supportCost { get; set; }
        public required string supportEffect { get; set; }


        public ICollection<Deck> Decks { get; set; } = new List<Deck>();
    }
}