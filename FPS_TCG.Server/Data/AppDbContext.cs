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
        public DbSet<ImageEntity> Images { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ImageEntity>(b =>
            {
                b.HasKey(i => i.ImageEntityId);
                b.Property(i => i.FileName).IsRequired().HasColumnType("TEXT");
                b.Property(i => i.Data).IsRequired().HasColumnType("BLOB");
                b.HasOne(i => i.Card)
                 .WithMany()
                 .HasForeignKey(i => i.CardId)
                 .OnDelete(DeleteBehavior.SetNull);
            });
        }
    }
}