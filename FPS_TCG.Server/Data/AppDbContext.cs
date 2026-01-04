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

            modelBuilder.Entity<Card>(b =>
            {
                b.Property(c => c.ImageData).HasColumnType("BLOB");
                b.Property(c => c.ImageContentType).HasColumnType("TEXT");
                b.Property(c => c.ImageFileName).HasColumnType("TEXT");
            });
        }
    }
}