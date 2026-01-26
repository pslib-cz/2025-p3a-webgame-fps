using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FPS_TCG.Server.Models;

namespace FPS_TCG.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Card> Cards { get; set; } = null!;
        public DbSet<Deck> Decks { get; set; } = null!;


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Deck>()
                .HasMany(d => d.Cards)
                .WithMany(c => c.Decks)
                .UsingEntity<Dictionary<string, object>>(
                    "DeckCard",
                    j => j.HasOne<Card>().WithMany().HasForeignKey("CardId").OnDelete(DeleteBehavior.NoAction),
                    j => j.HasOne<Deck>().WithMany().HasForeignKey("DeckId").OnDelete(DeleteBehavior.NoAction),
                    j =>
                    {
                        j.HasKey("DeckId", "CardId");
                        j.ToTable("DeckCards");
                    });
        }
    }
}