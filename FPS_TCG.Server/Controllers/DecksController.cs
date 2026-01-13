using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FPS_TCG.Server.Data;
using FPS_TCG.Server.Models;

namespace FPS_TCG.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DecksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DecksController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Decks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Deck>>> GetDecks()
        {
            return await _context.Decks.ToListAsync();
        }

        // GET: api/Decks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Deck>> GetDeck(int id)
        {
            var deck = await _context.Decks.FindAsync(id);

            if (deck == null)
            {
                return NotFound();
            }

            return deck;
        }

        // PUT: api/Decks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeck(int id, Deck deck)
        {
            if (id != deck.DeckId)
            {
                return BadRequest();
            }

            _context.Entry(deck).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeckExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Decks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Deck>> PostDeck(Deck deck)
        {
            if (deck == null)
                return BadRequest("Deck is null.");

            // If caller supplied cards, ensure existing cards are attached (tracked) instead of re-inserted.
            if (deck.Cards != null && deck.Cards.Count > 0)
            {
                // IDs that look like existing items
                var incomingIds = deck.Cards.Where(c => c.CardId > 0).Select(c => c.CardId).Distinct().ToList();

                List<Card> trackedExisting = new();
                if (incomingIds.Count > 0)
                {
                    trackedExisting = await _context.Cards
                        .Where(c => incomingIds.Contains(c.CardId))
                        .ToListAsync();

                    var missing = incomingIds.Except(trackedExisting.Select(c => c.CardId)).ToList();
                    if (missing.Any())
                    {
                        // caller referenced Card IDs that do not exist in DB
                        return BadRequest($"Referenced Card IDs not found: {string.Join(',', missing)}");
                    }
                }

                // Build final card list: replace inbound objects for existing ids with tracked entities
                var finalCards = new List<Card>(deck.Cards.Count);
                foreach (var incoming in deck.Cards)
                {
                    if (incoming.CardId > 0)
                    {
                        // use the tracked instance (so EF won't attempt to insert)
                        var tracked = trackedExisting.Single(c => c.CardId == incoming.CardId);
                        finalCards.Add(tracked);
                    }
                    else
                    {
                        // new card — ensure CardId == 0 so DB can generate it
                        incoming.CardId = 0;
                        finalCards.Add(incoming);
                    }
                }

                deck.Cards = finalCards;
            }

            _context.Decks.Add(deck);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDeck", new { id = deck.DeckId }, deck);
        }

        // DELETE: api/Decks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeck(int id)
        {
            var deck = await _context.Decks.FindAsync(id);
            if (deck == null)
            {
                return NotFound();
            }

            _context.Decks.Remove(deck);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DeckExists(int id)
        {
            return _context.Decks.Any(e => e.DeckId == id);
        }
    }
}
