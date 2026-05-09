using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.DTOs;
using RentIt.Server.Models;

namespace RentIt.Server.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAll([FromQuery] int? equipmentId)
    {
        var query = db.Reviews
            .Include(r => r.Author)
            .AsQueryable();

        if (equipmentId.HasValue)
            query = query.Where(r => r.EquipmentId == equipmentId.Value);

        var items = await query.ToListAsync();
        return Ok(items.Select(ToDto));
    }

    [HttpPost]
    public async Task<ActionResult<object>> Create([FromBody] CreateReviewDto dto)
    {
        var review = new Review
        {
            Rating = dto.Rating,
            Comment = dto.Comment,
            AuthorId = dto.AuthorId,
            EquipmentId = dto.EquipmentId,
            RentalId = dto.RentalId,
        };

        db.Reviews.Add(review);
        await db.SaveChangesAsync();

        var created = await db.Reviews
            .Include(r => r.Author)
            .FirstAsync(r => r.Id == review.Id);

        return CreatedAtAction(nameof(GetAll), new { equipmentId = review.EquipmentId }, ToDto(created));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var review = await db.Reviews.FindAsync(id);
        if (review is null)
            return NotFound();

        db.Reviews.Remove(review);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static object ToDto(Review r) => new
    {
        r.Id,
        r.Rating,
        r.Comment,
        r.CreatedAt,
        r.AuthorId,
        r.EquipmentId,
        r.RentalId,
        Author = r.Author is null ? null : new
        {
            r.Author.Id,
            r.Author.FirstName,
            r.Author.LastName,
            r.Author.Email,
            r.Author.Address,
            r.Author.CreatedAt,
        }
    };
}
