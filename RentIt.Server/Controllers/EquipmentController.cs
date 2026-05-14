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
    [HttpGet]
    [ProducesResponseType<IEnumerable<EquipmentDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EquipmentDto>>> GetAll(
        [FromQuery] string? city,
        [FromQuery] EquipmentCategory? category,
        [FromQuery] DateTime? dateFrom,
        [FromQuery] DateTime? dateTo)
    {
        var query = db.Equipment
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(city))
            query = query.Where(e => e.Address.Contains(city));

        if (category.HasValue)
            query = query.Where(e => e.Category == category.Value);

        if (dateFrom.HasValue && dateTo.HasValue)
            query = query.Where(e =>
                !e.Rentals.Any(r => r.DateFrom < dateTo.Value && dateFrom.Value < r.DateTo) &&
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
            .Where(r => r.EquipmentId == id && r.DateFrom < dateTo && dateFrom < r.DateTo)
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
    [ProducesResponseType<EquipmentDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<EquipmentDto>> Create([FromBody] CreateEquipmentDto dto)
    {
        var equipment = new Equipment
        {
            Name = dto.Name,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            PricePerDay = dto.PricePerDay,
            Deposit = dto.Deposit,
            Address = dto.Address,
            UserId = dto.UserId,
            Category = dto.Category,
            Status = dto.Status,
        };

        db.Equipment.Add(equipment);
        await db.SaveChangesAsync();

        var created = await db.Equipment.FirstAsync(e => e.Id == equipment.Id);

        return CreatedAtAction(nameof(GetById), new { id = equipment.Id }, ToDto(created));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEquipmentDto dto)
    {
        var equipment = await db.Equipment
            .FirstOrDefaultAsync(e => e.Id == id);

        if (equipment is null)
            return NotFound();

        equipment.Name = dto.Name;
        equipment.Description = dto.Description;
        equipment.ImageUrl = dto.ImageUrl;
        equipment.PricePerDay = dto.PricePerDay;
        equipment.Deposit = dto.Deposit;
        equipment.Address = dto.Address;
        equipment.UserId = dto.UserId;
        equipment.Category = dto.Category;
        equipment.Status = dto.Status;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var equipment = await db.Equipment.FindAsync(id);
        if (equipment is null)
            return NotFound();

        db.Equipment.Remove(equipment);
        await db.SaveChangesAsync();
        return NoContent();
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
            Category = e.Category,
            Status = e.Status,
        };
}
