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

        // POST api/cards/with-image
        // multipart/form-data: form fields + file field "image"
        [HttpPost("with-image")]
        public async Task<IActionResult> CreateWithImage(
            [FromForm] string name,
            [FromForm] string type,
            [FromForm] int health = 0,
            [FromForm] int shield = 0,
            [FromForm] string skill1Name = "",
            [FromForm] int skill1Damage = 0,
            [FromForm] int skill1Cost = 0,
            [FromForm] string skill2Name = "",
            [FromForm] string skill2Effect = "",
            [FromForm] int skill2Cost = 0,
            [FromForm] int supportCost = 0,
            [FromForm] string supportEffect = "",
            [FromForm] IFormFile? image = null)
        {
            var typeNormalized = type?.Trim().ToLowerInvariant();
            if (typeNormalized != "attack" && typeNormalized != "support")
                return BadRequest(new { error = "type must be either 'attack' or 'support'." });

            var card = new Card
            {
                CardId = 1,
                Name = name,
                type = typeNormalized!,
                health = health,
                shield = 0,
                Skill1Name = skill1Name,
                Skill1Damage = skill1Damage,
                Skill1Cost = skill1Cost,
                Skill2Name = skill2Name,
                skill2Effect = skill2Effect,
                Skill2Cost = skill2Cost,
                supportCost = supportCost,
                supportEffect = supportEffect,
                ImageData = null,
                ImageContentType = null,
                ImageFileName = null
            };

            _db.Cards.Add(card);
            await _db.SaveChangesAsync();

            if (image != null && image.Length > 0)
            {
                using var ms = new MemoryStream();
                await image.CopyToAsync(ms);
                card.ImageData = ms.ToArray();
                card.ImageContentType = image.ContentType;
                card.ImageFileName = image.FileName;

                _db.Cards.Update(card);
                await _db.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetByIdAsync), new { id = card.CardId }, card);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CardDto>>> GetAllAsync()
        {
            var cards = await _db.Cards
                .AsNoTracking()
                .Select(c => new CardDto
                {
                    CardId = c.CardId,
                    Name = c.Name,
                    Type = c.type,
                    Health = c.health,
                    Shield = c.shield,
                    Skill1Name = c.Skill1Name,
                    Skill1Damage = c.Skill1Damage,
                    Skill1Cost = c.Skill1Cost,
                    Skill2Name = c.Skill2Name,
                    Skill2Effect = c.skill2Effect,
                    Skill2Cost = c.Skill2Cost,
                    SupportCost = c.supportCost,
                    SupportEffect = c.supportEffect
                })
                .ToListAsync();

            return Ok(cards);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<CardDto>> GetByIdAsync(int id)
        {
            var card = await _db.Cards
                .AsNoTracking()
                .Where(c => c.CardId == id)
                .Select(c => new CardDto
                {
                    CardId = c.CardId,
                    Name = c.Name,
                    Type = c.type,
                    Health = c.health,
                    Shield = c.shield,
                    Skill1Name = c.Skill1Name,
                    Skill1Damage = c.Skill1Damage,
                    Skill1Cost = c.Skill1Cost,
                    Skill2Name = c.Skill2Name,
                    Skill2Effect = c.skill2Effect,
                    Skill2Cost = c.Skill2Cost,
                    SupportCost = c.supportCost,
                    SupportEffect = c.supportEffect
                })
                .FirstOrDefaultAsync();

            if (card == null)
                return NotFound();

            return Ok(card);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var card = await _db.Cards.FindAsync(id);
            if (card == null)
                return NotFound();
            _db.Cards.Remove(card);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // GET api/cards/{id}/image/as-png - vrátí obrázek uložený v Card.ImageData jako PNG (pøevod ImageSharp)
        [HttpGet("{id:int}/image/as-png")]
        public async Task<IActionResult> GetCardImageAsPngAsync(int id)
        {
            var card = await _db.Cards.AsNoTracking().FirstOrDefaultAsync(c => c.CardId == id);
            if (card == null) return NotFound();
            if (card.ImageData == null || card.ImageData.Length == 0) return NotFound();

            // už je PNG?
            if (IsPng(card.ImageData))
                return File(card.ImageData, "image/png", PathForDownloadName(card.ImageFileName, "png"));

            try
            {
                using var image = Image.Load(card.ImageData);
                using var ms = new MemoryStream();
                image.Save(ms, new PngEncoder());
                var png = ms.ToArray();
                return File(png, "image/png", PathForDownloadName(card.ImageFileName, "png"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Image conversion failed", detail = ex.Message });
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