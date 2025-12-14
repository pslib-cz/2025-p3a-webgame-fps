using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FPS_TCG.Server.Data;
using FPS_TCG.Server.Models;

namespace FPS_TCG.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CardsController(AppDbContext db) => _db = db;

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

            return CreatedAtAction(nameof(GetById), new { id = card.CardId }, card);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var card = await _db.Cards.FindAsync(id);
            if (card == null) return NotFound();
            return Ok(card);
        }
    }
}