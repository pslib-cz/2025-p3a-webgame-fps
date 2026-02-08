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

            var typeNormalized = card.Type?.Trim().ToLowerInvariant();
            if (typeNormalized != "attack" && typeNormalized != "support")
                return BadRequest(new { error = "type must be either 'attack' or 'support'." });

            card.Type = typeNormalized;
            card.Shield = 0;

            _db.Cards.Add(card);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetByIdAsync), new { id = card.CardId }, card);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Card>>> GetAllAsync()
        {
            var cards = await _db.Cards
                .AsNoTracking()
                .Select(c => new Card
                {
                    CardId = c.CardId,
                    Name = c.Name,
                    Type = c.Type,
                    Health = c.Health,
                    Shield = c.Shield,
                    Skill1Name = c.Skill1Name,
                    Skill1Damage = c.Skill1Damage,
                    Skill1Cost = c.Skill1Cost,
                    Skill2Name = c.Skill2Name,
                    Skill2Effect = c.Skill2Effect,
                    Skill2Damage = c.Skill2Damage,
                    Skill2Cost = c.Skill2Cost,
                    SupportCost = c.SupportCost,
                    SupportEffect = c.SupportEffect
                })
                .ToListAsync();

            return Ok(cards);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] Card updated)
        {
            if (updated == null)
                return BadRequest();

            if (string.IsNullOrWhiteSpace(updated.Name))
                return BadRequest(new { error = "Name is required." });

            var typeNormalized = updated.Type?.Trim().ToLowerInvariant();
            if (typeNormalized != "attack" && typeNormalized != "support")
                return BadRequest(new { error = "type must be either 'attack' or 'support'." });

            var existing = await _db.Cards.FirstOrDefaultAsync(c => c.CardId == id);
            if (existing == null)
                return NotFound();

            existing.Name = updated.Name.Trim();
            existing.Type = typeNormalized;
            existing.Health = updated.Health;
            existing.Shield = updated.Shield;
            existing.Skill1Name = updated.Skill1Name;
            existing.Skill1Damage = updated.Skill1Damage;
            existing.Skill1Cost = updated.Skill1Cost;
            existing.Skill2Name = updated.Skill2Name;
            existing.Skill2Effect = updated.Skill2Effect;
            existing.Skill2Damage = updated.Skill2Damage;
            existing.Skill2Cost = updated.Skill2Cost;
            existing.SupportCost = updated.SupportCost;
            existing.SupportEffect = updated.SupportEffect;
            existing.SupportDescription = updated.SupportDescription;

            await _db.SaveChangesAsync();

            return NoContent();
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
                    Type = c.Type,
                    Health = c.Health,
                    Shield = c.Shield,
                    Skill1Name = c.Skill1Name,
                    Skill1Damage = c.Skill1Damage,
                    Skill1Cost = c.Skill1Cost,
                    Skill2Name = c.Skill2Name,
                    Skill2Effect = c.Skill2Effect,
                    Skill2Damage = c.Skill2Damage,
                    Skill2Cost = c.Skill2Cost,
                    SupportCost = c.SupportCost,
                    SupportEffect = c.SupportEffect
                })
                .FirstOrDefaultAsync();

            if (card == null)
                return NotFound();

            return Ok(card);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var card = await _db.Cards
                .Include(c => c.Decks)
                .FirstOrDefaultAsync(c => c.CardId == id);

            if (card == null)
                return NotFound();

            card.Decks.Clear();
            await _db.SaveChangesAsync();

            _db.Cards.Remove(card);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}