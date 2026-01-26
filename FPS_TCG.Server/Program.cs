using FPS_TCG.Server.Data;
using FPS_TCG.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var connectionString =
    builder.Configuration.GetConnectionString("default")
        ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString)
           .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning)));

builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

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

        await db.Database.MigrateAsync();

        var cardsBefore = await db.Cards.CountAsync();
        logger.LogInformation("Cards count before seed: {count}", cardsBefore);

        const string seedCardName = "NejsemEdater";
        var exists = await db.Cards.AnyAsync(c => c.Name == seedCardName);
        if (!exists)
        {
            var possibleImages = new[]
            {
                Path.Combine(Directory.GetCurrentDirectory(), "Images"),
                Path.Combine(AppContext.BaseDirectory ?? string.Empty, "Images"),
                Path.Combine(Directory.GetCurrentDirectory(), "ImageToConvert"),
                Path.Combine(AppContext.BaseDirectory ?? string.Empty, "ImageToConvert")
            };
            var imagesFolder = possibleImages.FirstOrDefault(Directory.Exists) ?? possibleImages[0];
            logger.LogInformation("Images folder used for seed: {path}", imagesFolder);

            var attempts = 0;
            const int maxAttempts = 3;
            while (true)
            {
                attempts++;

                var maxCardId = await db.Cards.Select(c => (int?)c.CardId).MaxAsync() ?? 0;
                var maxDeckId = await db.Decks.Select(d => (int?)d.DeckId).MaxAsync() ?? 0;
                var newCardId = maxCardId + 1;
                var newDeckId = maxDeckId + 1;

                var card = new Card
                {
                    CardId = newCardId,
                    Name = seedCardName,// line 54 tam napsat jmeno karty
                    type = "support",
                    health = 5,
                    shield = 5,
                    Skill1Name = "Allegations",
                    Skill1Damage = 4,
                    Skill1Cost = 1,
                    Skill2Name = "Lez",
                    skill2Effect = "ClearingTheAllegations",
                    Skill2Cost = 4,
                    supportCost = 2,
                    supportEffect = "NajdeTiGF",
                };

                var deck = new Deck
                {
                    DeckId = newDeckId,
                    Name = "Starter Deck",
                    Cards = new List<Card>() 
                };

                db.Cards.Add(card);
                db.Decks.Add(deck);

                logger.LogInformation("Attempt {attempt} saving seed (CardId={cardId}, DeckId={deckId})...", attempts, newCardId, newDeckId);

                try
                {
                    await db.SaveChangesAsync();
                    logger.LogInformation("Seed saved. Cards before: {before}, after: {after}", cardsBefore, await db.Cards.CountAsync());
                    logger.LogInformation("GET cards at: /api/cards");
                    break;
                }
                catch (DbUpdateException dbEx)
                {
                    logger.LogWarning(dbEx, "DbUpdateException on seed attempt {attempt}: {msg}", attempts, dbEx.Message);

                    try
                    {
                        foreach (var entry in db.ChangeTracker.Entries().ToArray())
                        {
                            entry.State = EntityState.Detached;
                        }
                    }
                    catch (Exception detachEx)
                    {
                        logger.LogWarning(detachEx, "Error detaching entries: {msg}", detachEx.Message);
                    }

                    if (attempts >= maxAttempts)
                    {
                        logger.LogError(dbEx, "Failed to save seed after {maxAttempts} attempts.", maxAttempts);
                        throw;
                    }

                    await Task.Delay(100);
                    continue;
                }
            }
        }
        else
        {
            logger.LogInformation("Seed skipped � card with name '{name}' already exists.", seedCardName);
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error initializing database: {message}", ex.Message);
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

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");
app.Run();