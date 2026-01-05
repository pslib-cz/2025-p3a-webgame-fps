using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using FPS_TCG.Server.Data;
using FPS_TCG.Server.Models;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString =
    builder.Configuration.GetConnectionString("default")
        ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString)
           .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning)));

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        var conn = db.Database.GetDbConnection();
        var dbPath = conn.DataSource;
        logger.LogInformation("Using SQLite file: {path}", dbPath);

        // cesta ke složce Images (vedle spouštìného working directory / .csproj)
        var imagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "Images");
        logger.LogInformation("Images folder: {path}", imagesFolder);

        if (!await db.Cards.AnyAsync())
        {
            var imageResult = ImageConvertor.LoadImageBytesFromFolder(imagesFolder, "Bleh");

            db.Cards.Add(new Card
            {
                CardId = 1,
                Name = "Bleh",
                type = "attack",
                health = 10,
                shield = 0,
                Skill1Name = "Slash",
                Skill1Damage = 2,
                Skill1Cost = 1,
                Skill2Name = "Stab",
                skill2Effect = "bleed",
                Skill2Cost = 2,
                supportCost = 0,
                supportEffect = "none",
                ImageData = imageResult.Data,
                ImageContentType = imageResult.ContentType,
                ImageFileName = imageResult.FileName
            });

            db.Decks.Add(new Deck
            {
                DeckId = 1,
                Name = "Starter Deck",
                Cards = new List<Card>()
            });

            await db.SaveChangesAsync();
            logger.LogInformation("Seed card saved.");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error initializing database");
        throw;
    }
}

app.UseDefaultFiles();
app.MapStaticAssets();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");
app.Run();