using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.DTOs;
using RentIt.Server.Models;

namespace RentIt.Server.Controllers;

[ApiController]
[Route("api/equipment-availability-blocks")]
public class EquipmentAvailabilityBlocksController(AppDbContext db) : ControllerBase
{
    private int? CurrentUserId =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType<IEnumerable<EquipmentAvailabilityBlockDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EquipmentAvailabilityBlockDto>>> GetAll([FromQuery] int? equipmentId)
    {
        var query = db.EquipmentAvailabilityBlocks.AsQueryable();

        if (equipmentId.HasValue)
            query = query.Where(b => b.EquipmentId == equipmentId.Value);

        var blocks = await query
            .OrderBy(b => b.DateFrom)
            .ToListAsync();

        return Ok(blocks.Select(ToDto));
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    [ProducesResponseType<EquipmentAvailabilityBlockDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EquipmentAvailabilityBlockDto>> GetById(int id)
    {
        var block = await db.EquipmentAvailabilityBlocks.FindAsync(id);
        return block is null ? NotFound() : Ok(ToDto(block));
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType<EquipmentAvailabilityBlockDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ErrorResponseDto>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<EquipmentAvailabilityBlockDto>> Create([FromBody] CreateEquipmentAvailabilityBlockDto dto)
    {
        if (dto.DateFrom >= dto.DateTo)
            return BadRequest(new ErrorResponseDto { Message = "dateFrom musi byc wczesniejsze niz dateTo" });

        var equipment = await db.Equipment.FindAsync(dto.EquipmentId);
        if (equipment is null)
            return BadRequest(new ErrorResponseDto { Message = "Sprzet nie istnieje" });

        if (CurrentUserId != equipment.UserId)
            return Forbid();

        var block = new EquipmentAvailabilityBlock
        {
            EquipmentId = dto.EquipmentId,
            DateFrom = dto.DateFrom,
            DateTo = dto.DateTo,
            Reason = dto.Reason,
        };

        db.EquipmentAvailabilityBlocks.Add(block);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = block.Id }, ToDto(block));
    }

    [HttpPut("{id:int}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ErrorResponseDto>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEquipmentAvailabilityBlockDto dto)
    {
        if (dto.DateFrom >= dto.DateTo)
            return BadRequest(new ErrorResponseDto { Message = "dateFrom musi byc wczesniejsze niz dateTo" });

        var block = await db.EquipmentAvailabilityBlocks
            .Include(b => b.Equipment)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (block is null)
            return NotFound();

        if (CurrentUserId != block.Equipment?.UserId)
            return Forbid();

        block.DateFrom = dto.DateFrom;
        block.DateTo = dto.DateTo;
        block.Reason = dto.Reason;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var block = await db.EquipmentAvailabilityBlocks
            .Include(b => b.Equipment)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (block is null)
            return NotFound();

        if (CurrentUserId != block.Equipment?.UserId)
            return Forbid();

        db.EquipmentAvailabilityBlocks.Remove(block);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static EquipmentAvailabilityBlockDto ToDto(EquipmentAvailabilityBlock b) =>
        new()
        {
            Id = b.Id,
            EquipmentId = b.EquipmentId,
            DateFrom = b.DateFrom,
            DateTo = b.DateTo,
            Reason = b.Reason,
            CreatedAt = b.CreatedAt,
        };
}
