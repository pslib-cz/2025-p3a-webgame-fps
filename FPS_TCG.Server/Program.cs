using FPS_TCG.Server.Data;
using FPS_TCG.Server.Img;
using FPS_TCG.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
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

        // aplikuj migrace pøi startu
        await db.Database.MigrateAsync();

        var cardsBefore = await db.Cards.CountAsync();
        logger.LogInformation("Cards count before seed: {count}", cardsBefore);

        if (!await db.Cards.AnyAsync())
        {
            // cesta ke složce Images (vedle spouštìného working directory / .csproj)
            var imagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "Images");
            logger.LogInformation("Images folder: {path}", imagesFolder);

            var imageResult = ImageConvertor.LoadImageBytesFromFolder(imagesFolder, "Bleh");

            // Zjisti aktuální max ID v DB a vytvoø unikátní ID pro seed
            var maxCardId = await db.Cards.Select(c => (int?)c.CardId).MaxAsync() ?? 0;
            var maxDeckId = await db.Decks.Select(d => (int?)d.DeckId).MaxAsync() ?? 0;
            var newCardId = maxCardId + 1;
            var newDeckId = maxDeckId + 1;

            var card = new Card
            {
                CardId = newCardId,
                Name = "JsemEdater",
                type = "support",
                health = 5,
                shield = 5,
                Skill1Name = "Edate",
                Skill1Damage = 4,
                Skill1Cost = 1,
                Skill2Name = "IRLdate",
                skill2Effect = "NoMoreEdater ",
                Skill2Cost = 4,
                supportCost = 2,
                supportEffect = "prida stesti + 10",
                ImageData = imageResult.Data,
                ImageContentType = imageResult.ContentType,
                ImageFileName = imageResult.FileName
            };

            var deck = new Deck
            {
                DeckId = newDeckId,
                Name = "Starter Deck",
                Cards = new List<Card>() // nech prázdné nebo pøidej card podle potøeby
            };

            db.Cards.Add(card);
            db.Decks.Add(deck);

            logger.LogInformation("Saving seed to database (CardId={cardId}, DeckId={deckId})...", newCardId, newDeckId);
            await db.SaveChangesAsync();
            logger.LogInformation("Seed card saved.");

            var cardsAfter = await db.Cards.CountAsync();
            logger.LogInformation("Cards count after seed: {count}", cardsAfter);
        }
        else
        {
            logger.LogInformation("Database already contains cards; skipping seed.");
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