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
    [ProducesResponseType<IEnumerable<RentalDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<RentalDto>>> GetAll([FromQuery] int? equipmentId)
    {
        var query = db.Rentals
            .Include(r => r.Client)
            .Include(r => r.UserAddress)
            .AsQueryable();

        if (equipmentId.HasValue)
            query = query.Where(r => r.EquipmentId == equipmentId.Value);

        var items = await query.ToListAsync();
        return Ok(items.Select(ToDto));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType<RentalDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RentalDto>> GetById(int id)
    {
        var rental = await db.Rentals
            .Include(r => r.Client)
            .Include(r => r.UserAddress)
            .FirstOrDefaultAsync(r => r.Id == id);

        return rental is null ? NotFound() : Ok(ToDto(rental));
    }

    [HttpPost]
    [ProducesResponseType<RentalDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ErrorResponseDto>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RentalDto>> Create([FromBody] CreateRentalDto dto)
    {
        if (dto.DateFrom >= dto.DateTo)
            return BadRequest(new ErrorResponseDto { Message = "dateFrom musi byc wczesniejsze niz dateTo" });

        var addressResult = await ResolveRentalAddress(dto.ClientId, dto.UserAddressId, dto.Address);
        if (addressResult.Error is not null)
            return BadRequest(addressResult.Error);

        if (await HasAvailabilityConflict(dto.EquipmentId, dto.DateFrom, dto.DateTo))
            return BadRequest(new ErrorResponseDto { Message = "Sprzet nie jest dostepny w wybranym terminie" });

        var rental = new Rental
        {
            DateFrom = dto.DateFrom,
            DateTo = dto.DateTo,
            Notes = dto.Notes,
            Address = addressResult.Address,
            ClientId = dto.ClientId,
            EquipmentId = dto.EquipmentId,
            UserAddressId = dto.UserAddressId,
            Status = dto.Status,
        };

        db.Rentals.Add(rental);
        await db.SaveChangesAsync();

        var created = await db.Rentals
            .Include(r => r.Client)
            .Include(r => r.UserAddress)
            .FirstAsync(r => r.Id == rental.Id);

        return CreatedAtAction(nameof(GetById), new { id = rental.Id }, ToDto(created));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ErrorResponseDto>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRentalDto dto)
    {
        if (dto.DateFrom >= dto.DateTo)
            return BadRequest(new ErrorResponseDto { Message = "dateFrom musi byc wczesniejsze niz dateTo" });

        var rental = await db.Rentals.FindAsync(id);
        if (rental is null)
            return NotFound();

        var addressResult = await ResolveRentalAddress(dto.ClientId, dto.UserAddressId, dto.Address);
        if (addressResult.Error is not null)
            return BadRequest(addressResult.Error);

        if (await HasAvailabilityConflict(dto.EquipmentId, dto.DateFrom, dto.DateTo, id))
            return BadRequest(new ErrorResponseDto { Message = "Sprzet nie jest dostepny w wybranym terminie" });

        rental.DateFrom = dto.DateFrom;
        rental.DateTo = dto.DateTo;
        rental.Notes = dto.Notes;
        rental.Address = addressResult.Address;
        rental.ClientId = dto.ClientId;
        rental.EquipmentId = dto.EquipmentId;
        rental.UserAddressId = dto.UserAddressId;
        rental.Status = dto.Status;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id:int}/status")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var rental = await db.Rentals.FindAsync(id);
        if (rental is null)
            return NotFound();

        db.Rentals.Remove(rental);
        await db.SaveChangesAsync();
        return NoContent();
    }

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
            UserAddressId = r.UserAddressId,
            Status = r.Status,
            Client = ToUserDto(r.Client),
            UserAddress = ToAddressDto(r.UserAddress),
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

    private async Task<bool> HasAvailabilityConflict(
        int equipmentId,
        DateTime dateFrom,
        DateTime dateTo,
        int? ignoredRentalId = null)
    {
        var rentalConflict = await db.Rentals.AnyAsync(r =>
            r.EquipmentId == equipmentId &&
            (!ignoredRentalId.HasValue || r.Id != ignoredRentalId.Value) &&
            r.DateFrom < dateTo &&
            dateFrom < r.DateTo);

        if (rentalConflict)
            return true;

        return await db.EquipmentAvailabilityBlocks.AnyAsync(b =>
            b.EquipmentId == equipmentId &&
            b.DateFrom < dateTo &&
            dateFrom < b.DateTo);
    }

    private async Task<(string Address, ErrorResponseDto? Error)> ResolveRentalAddress(
        int clientId,
        int? userAddressId,
        string address)
    {
        if (!userAddressId.HasValue)
        {
            var trimmed = address.Trim();
            return string.IsNullOrWhiteSpace(trimmed)
                ? (string.Empty, new ErrorResponseDto { Message = "Podaj adres odbioru" })
                : (trimmed, null);
        }

        var userAddress = await db.UserAddresses.FindAsync(userAddressId.Value);
        if (userAddress is null)
            return (string.Empty, new ErrorResponseDto { Message = "Adres nie istnieje" });

        if (userAddress.UserId != clientId)
            return (string.Empty, new ErrorResponseDto { Message = "Adres nie nalezy do tego uzytkownika" });

        return (FormatAddress(userAddress), null);
    }

    private static string FormatAddress(UserAddress address) =>
        $"{address.Street}, {address.PostalCode} {address.City}, {address.Country}";

    private static UserAddressDto? ToAddressDto(UserAddress? a) =>
        a is null
            ? null
            : new UserAddressDto
            {
                Id = a.Id,
                UserId = a.UserId,
                Name = a.Name,
                Street = a.Street,
                City = a.City,
                PostalCode = a.PostalCode,
                Country = a.Country,
                IsDefault = a.IsDefault,
                CreatedAt = a.CreatedAt,
            };
}
