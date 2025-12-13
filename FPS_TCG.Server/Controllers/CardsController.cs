using System.Threading.Tasks;
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
        public async Task<IActionResult> PostCard([FromBody] Card card)
        {
            _db.Cards.Add(card);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCard), new { id = card.CardId }, card);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCard(int id)
        {
            var card = await _db.Cards.FindAsync(id);
            if (card == null) return NotFound();
            return Ok(card);
        }
    }
}