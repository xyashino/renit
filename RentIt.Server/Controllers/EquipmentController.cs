using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.DTOs;
using RentIt.Server.Models;

namespace RentIt.Server.Controllers;

[ApiController]
[Route("api/equipment")]
public class EquipmentController(AppDbContext db) : ControllerBase
{
    private int? CurrentUserId =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    [HttpGet]
    [ProducesResponseType<IEnumerable<EquipmentDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EquipmentDto>>> GetAll(
        [FromQuery] string? city,
        [FromQuery] int? category,
        [FromQuery] DateTime? dateFrom,
        [FromQuery] DateTime? dateTo)
    {
        var query = db.Equipment
            .Include(e => e.EquipmentCategories)
                .ThenInclude(ec => ec.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(city))
        {
            var pattern = $"%{city.Trim()}%";
            query = query.Where(e => EF.Functions.Like(e.Address, pattern));
        }

        if (category.HasValue)
            query = query.Where(e => e.EquipmentCategories.Any(ec => ec.CategoryId == category.Value));

        if (dateFrom.HasValue && dateTo.HasValue)
            query = query.Where(e =>
                !e.Rentals.Any(r =>
                    (r.Status == RentalStatus.Pending || r.Status == RentalStatus.Active) &&
                    r.DateFrom < dateTo.Value && dateFrom.Value < r.DateTo) &&
                !e.AvailabilityBlocks.Any(b => b.DateFrom < dateTo.Value && dateFrom.Value < b.DateTo));

        var items = await query.ToListAsync();
        return Ok(items.Select(ToDto));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType<EquipmentDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EquipmentDto>> GetById(int id)
    {
        var equipment = await db.Equipment
            .Include(e => e.EquipmentCategories)
                .ThenInclude(ec => ec.Category)
            .FirstOrDefaultAsync(e => e.Id == id);

        return equipment is null ? NotFound() : Ok(ToDto(equipment));
    }

    [HttpGet("{id:int}/availability")]
    [ProducesResponseType<IEnumerable<BlockedRangeDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ErrorResponseDto>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<BlockedRangeDto>>> CheckAvailability(
        int id,
        [FromQuery] DateTime dateFrom,
        [FromQuery] DateTime dateTo)
    {
        if (dateFrom >= dateTo)
            return BadRequest(new ErrorResponseDto { Message = "dateFrom musi byc wczesniejsze niz dateTo" });

        if (!await db.Equipment.AnyAsync(e => e.Id == id))
            return NotFound();

        var rentalRanges = await db.Rentals
            .Where(r =>
                r.EquipmentId == id &&
                (r.Status == RentalStatus.Pending || r.Status == RentalStatus.Active) &&
                r.DateFrom < dateTo &&
                dateFrom < r.DateTo)
            .OrderBy(r => r.DateFrom)
            .Select(r => new BlockedRangeDto
            {
                RentalId = r.Id,
                DateFrom = r.DateFrom,
                DateTo = r.DateTo,
                Status = r.Status,
                Type = "rental",
            })
            .ToListAsync();

        var availabilityBlocks = await db.EquipmentAvailabilityBlocks
            .Where(b => b.EquipmentId == id && b.DateFrom < dateTo && dateFrom < b.DateTo)
            .OrderBy(b => b.DateFrom)
            .Select(b => new BlockedRangeDto
            {
                AvailabilityBlockId = b.Id,
                DateFrom = b.DateFrom,
                DateTo = b.DateTo,
                Type = "availabilityBlock",
                Reason = b.Reason,
            })
            .ToListAsync();

        var blockedRanges = rentalRanges
            .Concat(availabilityBlocks)
            .OrderBy(r => r.DateFrom);

        return Ok(blockedRanges);
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType<EquipmentDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<EquipmentDto>> Create([FromBody] CreateEquipmentDto dto)
    {
        if (CurrentUserId is null)
            return Forbid();

        var owner = await db.Users.FindAsync(CurrentUserId.Value);
        if (owner is null || owner.AccountType != UserAccountType.Owner)
            return Forbid();

        var equipment = new Equipment
        {
            Name = dto.Name,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            PricePerDay = dto.PricePerDay,
            Deposit = dto.Deposit,
            Address = dto.Address?.Trim() ?? string.Empty,
            UserId = CurrentUserId.Value,
            Status = dto.Status,
        };

        db.Equipment.Add(equipment);
        await db.SaveChangesAsync();

        await SyncCategories(equipment.Id, dto.CategoryIds);

        var created = await db.Equipment
            .Include(e => e.EquipmentCategories)
                .ThenInclude(ec => ec.Category)
            .FirstAsync(e => e.Id == equipment.Id);

        return CreatedAtAction(nameof(GetById), new { id = equipment.Id }, ToDto(created));
    }

    [HttpPut("{id:int}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEquipmentDto dto)
    {
        var equipment = await db.Equipment
            .FirstOrDefaultAsync(e => e.Id == id);

        if (equipment is null)
            return NotFound();

        if (CurrentUserId != equipment.UserId)
            return Forbid();

        equipment.Name = dto.Name;
        equipment.Description = dto.Description;
        equipment.ImageUrl = dto.ImageUrl;
        equipment.PricePerDay = dto.PricePerDay;
        equipment.Deposit = dto.Deposit;
        equipment.Address = dto.Address?.Trim() ?? string.Empty;
        equipment.Status = dto.Status;

        await db.SaveChangesAsync();
        await SyncCategories(equipment.Id, dto.CategoryIds);

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var equipment = await db.Equipment.FindAsync(id);
        if (equipment is null)
            return NotFound();

        if (CurrentUserId != equipment.UserId)
            return Forbid();

        db.Equipment.Remove(equipment);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private async Task SyncCategories(int equipmentId, List<int> categoryIds)
    {
        var distinctIds = categoryIds.Distinct().ToList();

        var validIds = await db.Categories
            .Where(c => distinctIds.Contains(c.Id))
            .Select(c => c.Id)
            .ToListAsync();

        var existing = await db.EquipmentCategories
            .Where(ec => ec.EquipmentId == equipmentId)
            .ToListAsync();

        var toRemove = existing.Where(ec => !validIds.Contains(ec.CategoryId)).ToList();
        if (toRemove.Count > 0)
            db.EquipmentCategories.RemoveRange(toRemove);

        var existingIds = existing.Select(ec => ec.CategoryId).ToHashSet();
        var toAdd = validIds
            .Where(id => !existingIds.Contains(id))
            .Select(categoryId => new EquipmentCategory { EquipmentId = equipmentId, CategoryId = categoryId });

        db.EquipmentCategories.AddRange(toAdd);
        await db.SaveChangesAsync();
    }

    private static EquipmentDto ToDto(Equipment e) =>
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
