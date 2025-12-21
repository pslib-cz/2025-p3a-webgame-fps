using System;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using FPS_TCG.Server.Data;
using FPS_TCG.Server.Models;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;

namespace FPS_TCG.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CardsController(AppDbContext db)
        {
            _db = db;
        }
            
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Card card)
        {
            if (card == null)
                return BadRequest();

            var typeNormalized = card.type?.Trim().ToLowerInvariant();
            if (typeNormalized != "attack" && typeNormalized != "support")
                return BadRequest(new { error = "type must be either 'attack' or 'support'." });

            card.type = typeNormalized;
            card.shield = 0;

            _db.Cards.Add(card);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetByIdAsync), new { id = card.CardId }, card);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Card>>> GetAllAsync()
        {
            var cards = await _db.Cards
                .AsNoTracking()
                .ToListAsync();

            return Ok(cards);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Card>> GetByIdAsync(int id)
        {
            var card = await _db.Cards
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.CardId == id);

            if (card == null)
                return NotFound();

            return Ok(card);
        }


        [HttpGet("{id:int}/image/as-png")]
        public async Task<IActionResult> GetCardImageAsPngAsync(int id)
        {
            byte[]? data = null;
            string? originalName = null;

            try
            {
                var imgEntity = await _db.Images
                    .AsNoTracking()
                    .FirstOrDefaultAsync(i => i.CardId == id);
                if (imgEntity != null)
                {
                    data = imgEntity.Data;
                    originalName = imgEntity.FileName;
                }
            }
            catch
            {
                
            }

            if (data == null || data.Length == 0)
            {
                var card = await _db.Cards.AsNoTracking().FirstOrDefaultAsync(c => c.CardId == id);
                if (card == null) return NotFound();

                var cardType = card.GetType();
                var propData = cardType.GetProperty("ImageData");
                if (propData != null && propData.PropertyType == typeof(byte[]))
                {
                    data = (byte[]?)propData.GetValue(card);
                    originalName = cardType.GetProperty("ImageFileName")?.GetValue(card) as string;
                }
            }

            if (data == null || data.Length == 0)
                return NotFound();

            if (IsPng(data))
                return File(data, "image/png", PathForDownloadName(originalName, "png"));

            try
            {
                using var image = Image.Load(data);
                using var ms = new MemoryStream();
                image.Save(ms, new PngEncoder());
                var pngBytes = ms.ToArray();
                return File(pngBytes, "image/png", PathForDownloadName(originalName, "png"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to convert image to PNG.", detail = ex.Message });
            }
        }

        private static bool IsPng(byte[] b)
        {
            return b.Length >= 8 &&
                   b[0] == 0x89 && b[1] == 0x50 && b[2] == 0x4E && b[3] == 0x47 &&
                   b[4] == 0x0D && b[5] == 0x0A && b[6] == 0x1A && b[7] == 0x0A;
        }

        private static string PathForDownloadName(string? originalName, string forcedExt)
        {
            if (string.IsNullOrEmpty(originalName))
                return $"image.{forcedExt}";
            var name = Path.GetFileNameWithoutExtension(originalName);
            return $"{name}.{forcedExt}";
        }
    }
}