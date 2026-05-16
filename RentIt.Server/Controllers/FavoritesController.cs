using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.DTOs;
using RentIt.Server.Models;

namespace RentIt.Server.Controllers;

[ApiController]
[Authorize]
[Route("api/favorites")]
public class FavoritesController(AppDbContext db) : ControllerBase
{
    private int? CurrentUserId =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    [HttpGet]
    [ProducesResponseType<IEnumerable<FavoriteEquipmentDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<IEnumerable<FavoriteEquipmentDto>>> GetAll([FromQuery] int? equipmentId)
    {
        if (CurrentUserId is null)
            return Forbid();

        var meId = CurrentUserId.Value;

        var query = db.FavoriteEquipment
            .Include(f => f.Equipment)
                .ThenInclude(e => e!.EquipmentCategories)
                    .ThenInclude(ec => ec.Category)
            .Where(f => f.UserId == meId);

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
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType<ErrorResponseDto>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<FavoriteEquipmentDto>> Create([FromBody] CreateFavoriteEquipmentDto dto)
    {
        if (CurrentUserId is null)
            return Forbid();

        var userId = CurrentUserId.Value;

        var user = await db.Users.FindAsync(userId);
        if (user is null || user.AccountType != UserAccountType.Client)
            return Forbid();

        if (!await db.Equipment.AnyAsync(e => e.Id == dto.EquipmentId))
            return BadRequest(new ErrorResponseDto { Message = "Sprzet nie istnieje" });

        if (await db.FavoriteEquipment.AnyAsync(f => f.UserId == userId && f.EquipmentId == dto.EquipmentId))
            return Conflict(new ErrorResponseDto { Message = "Sprzet jest juz w ulubionych" });

        var favorite = new FavoriteEquipment
        {
            UserId = userId,
            EquipmentId = dto.EquipmentId,
        };

        db.FavoriteEquipment.Add(favorite);
        await db.SaveChangesAsync();

        var created = await db.FavoriteEquipment
            .Include(f => f.Equipment)
                .ThenInclude(e => e!.EquipmentCategories)
                    .ThenInclude(ec => ec.Category)
            .FirstAsync(f => f.UserId == userId && f.EquipmentId == dto.EquipmentId);

        return CreatedAtAction(nameof(GetAll), new { equipmentId = dto.EquipmentId }, ToDto(created));
    }

    [HttpDelete("{equipmentId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int equipmentId)
    {
        if (CurrentUserId is null)
            return Forbid();

        var favorite = await db.FavoriteEquipment.FindAsync(CurrentUserId.Value, equipmentId);
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
            Status = e.Status,
            Categories = e.EquipmentCategories
                .Where(ec => ec.Category is not null)
                .Select(ec => new CategoryDto
                {
                    Id = ec.Category!.Id,
                    Name = ec.Category.Name,
                    Key = ec.Category.Key,
                })
                .ToList(),
        };
}
