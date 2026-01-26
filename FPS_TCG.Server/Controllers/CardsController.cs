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

        // POST api/cards/with-image
        // multipart/form-data: form fields + file field "image"
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Card>>> GetAllAsync()
        {
            var cards = await _db.Cards
                .AsNoTracking()
                .Select(c => new Card
                {
                    CardId = c.CardId,
                    Name = c.Name,
                    type = c.type,
                    health = c.health,
                    shield = c.shield,
                    Skill1Name = c.Skill1Name,
                    Skill1Damage = c.Skill1Damage,
                    Skill1Cost = c.Skill1Cost,
                    Skill2Name = c.Skill2Name,
                    skill2Effect = c.skill2Effect,
                    Skill2Damage = c.Skill2Damage,
                    Skill2Cost = c.Skill2Cost,
                    supportCost = c.supportCost,
                    supportEffect = c.supportEffect
                })
                .ToListAsync();

            return Ok(cards);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Card>> GetByIdAsync(int id)
        {
            var card = await _db.Cards
                .AsNoTracking()
                .Where(c => c.CardId == id)
                .Select(c => new Card
                {
                    CardId = c.CardId,
                    Name = c.Name,
                    type = c.type,
                    health = c.health,
                    shield = c.shield,
                    Skill1Name = c.Skill1Name,
                    Skill1Damage = c.Skill1Damage,
                    Skill1Cost = c.Skill1Cost,
                    Skill2Name = c.Skill2Name,
                    skill2Effect = c.skill2Effect,
                    Skill2Damage = c.Skill2Damage,
                    Skill2Cost = c.Skill2Cost,
                    supportCost = c.supportCost,
                    supportEffect = c.supportEffect
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