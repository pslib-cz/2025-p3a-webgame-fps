using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using FPS_TCG.Server.Data;
using FPS_TCG.Server.Models;
using Microsoft.EntityFrameworkCore;

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
                return BadRequest(new { error = "type musí být 'attack' nebo 'support'." });


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
                    SupportEffect = c.supportEffect,
                    IsSelected = c.isSelected
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
                    SupportEffect = c.supportEffect,
                    IsSelected = c.isSelected
                })
                .FirstOrDefaultAsync();

            if (card == null)
                return NotFound();

            return Ok(card);
        }
    }
}