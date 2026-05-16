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
[Route("api/rentals")]
public class RentalsController(AppDbContext db) : ControllerBase
{
    private int? CurrentUserId =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    [HttpGet]
    [ProducesResponseType<IEnumerable<RentalDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<RentalDto>>> GetAll([FromQuery] int? equipmentId)
    {
        if (CurrentUserId is null)
            return Forbid();

        var meId = CurrentUserId.Value;

        var query = db.Rentals
            .Include(r => r.Client)
            .Include(r => r.Equipment)
            .Where(r => r.ClientId == meId || r.Equipment!.UserId == meId);

        if (equipmentId.HasValue)
            query = query.Where(r => r.EquipmentId == equipmentId.Value);

        var items = await query.ToListAsync();
        return Ok(items.Select(ToDto));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType<RentalDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RentalDto>> GetById(int id)
    {
        var rental = await db.Rentals
            .Include(r => r.Client)
            .Include(r => r.Equipment)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (rental is null)
            return NotFound();

        if (!IsParticipant(rental))
            return Forbid();

        return Ok(ToDto(rental));
    }

    [HttpPost]
    [ProducesResponseType<RentalDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ErrorResponseDto>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<RentalDto>> Create([FromBody] CreateRentalDto dto)
    {
        if (CurrentUserId is null)
            return Forbid();

        var clientId = CurrentUserId.Value;

        var client = await db.Users.FindAsync(clientId);
        if (client is null || client.AccountType != UserAccountType.Client)
            return Forbid();

        if (dto.DateFrom >= dto.DateTo)
            return BadRequest(new ErrorResponseDto { Message = "dateFrom musi byc wczesniejsze niz dateTo" });

        var equipment = await db.Equipment.FindAsync(dto.EquipmentId);
        if (equipment is null)
            return BadRequest(new ErrorResponseDto { Message = "Sprzet nie istnieje" });

        if (equipment.UserId == clientId)
            return BadRequest(new ErrorResponseDto { Message = "Nie mozesz wypozyczyc wlasnego sprzetu" });

        if (await HasAvailabilityConflict(dto.EquipmentId, dto.DateFrom, dto.DateTo))
            return BadRequest(new ErrorResponseDto { Message = "Sprzet nie jest dostepny w wybranym terminie" });

        var rental = new Rental
        {
            DateFrom = dto.DateFrom,
            DateTo = dto.DateTo,
            Notes = dto.Notes,
            Address = equipment.Address,
            ClientId = clientId,
            EquipmentId = equipment.Id,
            Status = RentalStatus.Pending,
        };

        db.Rentals.Add(rental);
        await db.SaveChangesAsync();

        var created = await db.Rentals
            .Include(r => r.Client)
            .Include(r => r.Equipment)
            .FirstAsync(r => r.Id == rental.Id);

        return CreatedAtAction(nameof(GetById), new { id = rental.Id }, ToDto(created));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ErrorResponseDto>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRentalDto dto)
    {
        var rental = await db.Rentals.FindAsync(id);
        if (rental is null)
            return NotFound();

        if (CurrentUserId != rental.ClientId)
            return Forbid();

        if (rental.Status != RentalStatus.Pending)
            return BadRequest(new ErrorResponseDto { Message = "Edycja jest mozliwa tylko dla oczekujacych rezerwacji" });

        if (dto.DateFrom >= dto.DateTo)
            return BadRequest(new ErrorResponseDto { Message = "dateFrom musi byc wczesniejsze niz dateTo" });

        if (await HasAvailabilityConflict(rental.EquipmentId, dto.DateFrom, dto.DateTo, id))
            return BadRequest(new ErrorResponseDto { Message = "Sprzet nie jest dostepny w wybranym terminie" });

        rental.DateFrom = dto.DateFrom;
        rental.DateTo = dto.DateTo;
        rental.Notes = dto.Notes;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id:int}/status")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ErrorResponseDto>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateRentalStatusDto dto)
    {
        var rental = await db.Rentals
            .Include(r => r.Equipment)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (rental is null)
            return NotFound();

        if (CurrentUserId is null)
            return Forbid();

        var ownerId = rental.Equipment?.UserId;
        var isOwner = ownerId == CurrentUserId;
        var isClient = rental.ClientId == CurrentUserId;

        if (!isOwner && !isClient)
            return Forbid();

        if (!IsTransitionAllowed(rental.Status, dto.Status, isOwner, isClient))
            return BadRequest(new ErrorResponseDto { Message = "Niedozwolone przejscie statusu" });

        rental.Status = dto.Status;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var rental = await db.Rentals.FindAsync(id);
        if (rental is null)
            return NotFound();

        if (CurrentUserId != rental.ClientId)
            return Forbid();

        if (rental.Status != RentalStatus.Pending && rental.Status != RentalStatus.Cancelled)
            return BadRequest(new ErrorResponseDto { Message = "Usun rezerwacje przed potwierdzeniem lub po anulowaniu" });

        db.Rentals.Remove(rental);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private bool IsParticipant(Rental rental) =>
        CurrentUserId == rental.ClientId || CurrentUserId == rental.Equipment?.UserId;

    private static bool IsTransitionAllowed(RentalStatus current, RentalStatus next, bool isOwner, bool isClient) =>
        (current, next) switch
        {
            (RentalStatus.Pending, RentalStatus.Active) => isOwner,
            (RentalStatus.Active, RentalStatus.Completed) => isOwner,
            (RentalStatus.Pending, RentalStatus.Cancelled) => isClient || isOwner,
            (RentalStatus.Active, RentalStatus.Cancelled) => isClient || isOwner,
            _ => false,
        };

    private static RentalDto ToDto(Rental r) =>
        new()
        {
            Id = r.Id,
            DateFrom = r.DateFrom,
            DateTo = r.DateTo,
            Notes = r.Notes,
            Address = r.Address,
            ClientId = r.ClientId,
            EquipmentId = r.EquipmentId,
            Status = r.Status,
            Client = ToUserDto(r.Client),
            Equipment = r.Equipment is null ? null : ToEquipmentDto(r.Equipment),
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
                AccountType = u.AccountType,
                CreatedAt = u.CreatedAt,
            };

    private async Task<bool> HasAvailabilityConflict(
        int equipmentId,
        DateTime dateFrom,
        DateTime dateTo,
        int? ignoredRentalId = null)
    {
        var rentalConflict = await db.Rentals.AnyAsync(r =>
            r.EquipmentId == equipmentId &&
            (!ignoredRentalId.HasValue || r.Id != ignoredRentalId.Value) &&
            (r.Status == RentalStatus.Pending || r.Status == RentalStatus.Active) &&
            r.DateFrom < dateTo &&
            dateFrom < r.DateTo);

        if (rentalConflict)
            return true;

        return await db.EquipmentAvailabilityBlocks.AnyAsync(b =>
            b.EquipmentId == equipmentId &&
            b.DateFrom < dateTo &&
            dateFrom < b.DateTo);
    }
}
