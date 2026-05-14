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
    [ProducesResponseType<IEnumerable<ReviewDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetAll([FromQuery] int? equipmentId)
    {
        var query = db.Reviews
            .Include(r => r.Author)
            .AsQueryable();

        if (equipmentId.HasValue)
            query = query.Where(r => r.EquipmentId == equipmentId.Value);

        var items = await query.ToListAsync();
        return Ok(items.Select(ToDto));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType<ReviewDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ReviewDto>> GetById(int id)
    {
        var review = await db.Reviews
            .Include(r => r.Author)
            .FirstOrDefaultAsync(r => r.Id == id);

        return review is null ? NotFound() : Ok(ToDto(review));
    }

    [HttpPost]
    [ProducesResponseType<ReviewDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ReviewDto>> Create([FromBody] CreateReviewDto dto)
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

        return CreatedAtAction(nameof(GetById), new { id = review.Id }, ToDto(created));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateReviewDto dto)
    {
        var review = await db.Reviews.FindAsync(id);
        if (review is null)
            return NotFound();

        review.Rating = dto.Rating;
        review.Comment = dto.Comment;
        review.AuthorId = dto.AuthorId;
        review.EquipmentId = dto.EquipmentId;
        review.RentalId = dto.RentalId;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var review = await db.Reviews.FindAsync(id);
        if (review is null)
            return NotFound();

        db.Reviews.Remove(review);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static ReviewDto ToDto(Review r) =>
        new()
        {
            Id = r.Id,
            Rating = r.Rating,
            Comment = r.Comment,
            CreatedAt = r.CreatedAt,
            AuthorId = r.AuthorId,
            EquipmentId = r.EquipmentId,
            RentalId = r.RentalId,
            Author = ToUserDto(r.Author),
        };

    private static UserDto? ToUserDto(User? u) =>
        u is null
            ? null
            : new UserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Address = u.Address,
                CreatedAt = u.CreatedAt,
            };
}
