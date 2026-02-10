using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace FPS_TCG.Server.Models
{
    public class Card
    {
        public required int CardId { get; set; }

        public required string Name { get; set; }

        public required string Type { get; set; }

        public int Health { get; set; }
        public int Shield { get; set; }

        public required string Skill1Name { get; set; }
        public int Skill1Damage { get; set; }
        public required int Skill1Cost { get; set; }

        public required string Skill2Name { get; set; }
        public string? Skill2Effect { get; set; }
        public int Skill2Damage { get; set; }
        public required int Skill2Cost { get; set; }

        public int SupportCost { get; set; }
        public required string SupportEffect { get; set; }
        public string? SupportDescription { get; set; }

        public byte[]? ImageData { get; set; }
        public string? ImageContentType { get; set; }
        public string? ImageFileName { get; set; }

        public List<Deck> Decks { get; set; } = new();
    }
}