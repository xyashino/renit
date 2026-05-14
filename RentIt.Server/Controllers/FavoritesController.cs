using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.DTOs;
using RentIt.Server.Models;

namespace RentIt.Server.Controllers;

[ApiController]
[Route("api/favorites")]
public class FavoritesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IEnumerable<FavoriteEquipmentDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<FavoriteEquipmentDto>>> GetAll(
        [FromQuery] int? userId,
        [FromQuery] int? equipmentId)
    {
        var query = db.FavoriteEquipment
            .Include(f => f.Equipment)
            .AsQueryable();

        if (userId.HasValue)
            query = query.Where(f => f.UserId == userId.Value);

        if (equipmentId.HasValue)
            query = query.Where(f => f.EquipmentId == equipmentId.Value);

        var favorites = await query
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();

        return Ok(favorites.Select(ToDto));
    }

    [HttpPost]
    [ProducesResponseType<FavoriteEquipmentDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ErrorResponseDto>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ErrorResponseDto>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<FavoriteEquipmentDto>> Create([FromBody] CreateFavoriteEquipmentDto dto)
    {
        if (!await db.Users.AnyAsync(u => u.Id == dto.UserId))
            return BadRequest(new ErrorResponseDto { Message = "Uzytkownik nie istnieje" });

        if (!await db.Equipment.AnyAsync(e => e.Id == dto.EquipmentId))
            return BadRequest(new ErrorResponseDto { Message = "Sprzet nie istnieje" });

        if (await db.FavoriteEquipment.AnyAsync(f => f.UserId == dto.UserId && f.EquipmentId == dto.EquipmentId))
            return Conflict(new ErrorResponseDto { Message = "Sprzet jest juz w ulubionych" });

        var favorite = new FavoriteEquipment
        {
            UserId = dto.UserId,
            EquipmentId = dto.EquipmentId,
        };

        db.FavoriteEquipment.Add(favorite);
        await db.SaveChangesAsync();

        var created = await db.FavoriteEquipment
            .Include(f => f.Equipment)
            .FirstAsync(f => f.UserId == dto.UserId && f.EquipmentId == dto.EquipmentId);

        return CreatedAtAction(nameof(GetAll), new { userId = dto.UserId }, ToDto(created));
    }

    [HttpDelete("{userId:int}/{equipmentId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int userId, int equipmentId)
    {
        var favorite = await db.FavoriteEquipment.FindAsync(userId, equipmentId);
        if (favorite is null)
            return NotFound();

        db.FavoriteEquipment.Remove(favorite);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static FavoriteEquipmentDto ToDto(FavoriteEquipment f) =>
        new()
        {
            UserId = f.UserId,
            EquipmentId = f.EquipmentId,
            CreatedAt = f.CreatedAt,
            Equipment = f.Equipment is null ? null : ToEquipmentDto(f.Equipment),
        };

    private static EquipmentDto ToEquipmentDto(Equipment e) =>
        new()
        {
            Id = e.Id,
            Name = e.Name,
            Description = e.Description,
            ImageUrl = e.ImageUrl,
            PricePerDay = e.PricePerDay,
            Deposit = e.Deposit,
            Address = e.Address,
            UserId = e.UserId,
            Category = e.Category,
            Status = e.Status,
        };
}
