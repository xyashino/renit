using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.DTOs;
using RentIt.Server.Models;

namespace RentIt.Server.Controllers;

[ApiController]
[Route("api/rentals")]
public class RentalsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAll([FromQuery] int? equipmentId)
    {
        var query = db.Rentals
            .Include(r => r.Client)
            .AsQueryable();

        if (equipmentId.HasValue)
            query = query.Where(r => r.EquipmentId == equipmentId.Value);

        var items = await query.ToListAsync();
        return Ok(items.Select(ToDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<object>> GetById(int id)
    {
        var rental = await db.Rentals
            .Include(r => r.Client)
            .FirstOrDefaultAsync(r => r.Id == id);

        return rental is null ? NotFound() : Ok(ToDto(rental));
    }

    [HttpPost]
    public async Task<ActionResult<object>> Create([FromBody] CreateRentalDto dto)
    {
        var rental = new Rental
        {
            DateFrom = dto.DateFrom,
            DateTo = dto.DateTo,
            Notes = dto.Notes,
            Address = dto.Address,
            ClientId = dto.ClientId,
            EquipmentId = dto.EquipmentId,
            Status = dto.Status,
        };

        db.Rentals.Add(rental);
        await db.SaveChangesAsync();

        var created = await db.Rentals
            .Include(r => r.Client)
            .FirstAsync(r => r.Id == rental.Id);

        return CreatedAtAction(nameof(GetById), new { id = rental.Id }, ToDto(created));
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateRentalStatusDto dto)
    {
        var rental = await db.Rentals.FindAsync(id);
        if (rental is null)
            return NotFound();

        rental.Status = dto.Status;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var rental = await db.Rentals.FindAsync(id);
        if (rental is null)
            return NotFound();

        db.Rentals.Remove(rental);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static object ToDto(Rental r) => new
    {
        r.Id,
        r.DateFrom,
        r.DateTo,
        r.Notes,
        r.Address,
        r.ClientId,
        r.EquipmentId,
        r.Status,
        Client = r.Client is null ? null : new
        {
            r.Client.Id,
            r.Client.FirstName,
            r.Client.LastName,
            r.Client.Email,
            r.Client.Address,
            r.Client.CreatedAt,
        }
    };
}
