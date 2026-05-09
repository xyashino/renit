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
    public async Task<ActionResult<IEnumerable<object>>> GetAll(
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
            query = query.Where(e => !e.Rentals.Any(r => r.DateFrom < dateTo.Value && dateFrom.Value < r.DateTo));

        var items = await query.ToListAsync();
        return Ok(items.Select(ToDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<object>> GetById(int id)
    {
        var equipment = await db.Equipment
            .FirstOrDefaultAsync(e => e.Id == id);

        return equipment is null ? NotFound() : Ok(ToDto(equipment));
    }

    [HttpGet("{id:int}/availability")]
    public async Task<ActionResult<IEnumerable<BlockedRangeDto>>> CheckAvailability(
        int id,
        [FromQuery] DateTime dateFrom,
        [FromQuery] DateTime dateTo)
    {
        if (dateFrom >= dateTo)
            return BadRequest(new { message = "dateFrom musi byc wczesniejsze niz dateTo" });

        if (!await db.Equipment.AnyAsync(e => e.Id == id))
            return NotFound();

        var blockedRanges = await db.Rentals
            .Where(r => r.EquipmentId == id && r.DateFrom < dateTo && dateFrom < r.DateTo)
            .OrderBy(r => r.DateFrom)
            .Select(r => new BlockedRangeDto(r.Id, r.DateFrom, r.DateTo, r.Status))
            .ToListAsync();

        return Ok(blockedRanges);
    }

    [HttpPost]
    public async Task<ActionResult<object>> Create([FromBody] CreateEquipmentDto dto)
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
    public async Task<IActionResult> Update(int id, [FromBody] CreateEquipmentDto dto)
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
        equipment.Category = dto.Category;
        equipment.Status = dto.Status;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var equipment = await db.Equipment.FindAsync(id);
        if (equipment is null)
            return NotFound();

        db.Equipment.Remove(equipment);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static object ToDto(Equipment e) => new
    {
        e.Id,
        e.Name,
        e.Description,
        e.ImageUrl,
        e.PricePerDay,
        e.Deposit,
        e.Address,
        e.UserId,
        e.Category,
        e.Status,
    };
}
