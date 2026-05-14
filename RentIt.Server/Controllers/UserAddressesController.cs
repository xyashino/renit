using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.DTOs;
using RentIt.Server.Models;

namespace RentIt.Server.Controllers;

[ApiController]
[Route("api/user-addresses")]
public class UserAddressesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IEnumerable<UserAddressDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<UserAddressDto>>> GetAll([FromQuery] int? userId)
    {
        var query = db.UserAddresses.AsQueryable();

        if (userId.HasValue)
            query = query.Where(a => a.UserId == userId.Value);

        var addresses = await query
            .OrderByDescending(a => a.IsDefault)
            .ThenBy(a => a.Id)
            .ToListAsync();

        return Ok(addresses.Select(ToDto));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType<UserAddressDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserAddressDto>> GetById(int id)
    {
        var address = await db.UserAddresses.FindAsync(id);
        return address is null ? NotFound() : Ok(ToDto(address));
    }

    [HttpPost]
    [ProducesResponseType<UserAddressDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ErrorResponseDto>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserAddressDto>> Create([FromBody] CreateUserAddressDto dto)
    {
        if (!await db.Users.AnyAsync(u => u.Id == dto.UserId))
            return BadRequest(new ErrorResponseDto { Message = "Uzytkownik nie istnieje" });

        var shouldBeDefault = dto.IsDefault || !await db.UserAddresses.AnyAsync(a => a.UserId == dto.UserId);
        if (shouldBeDefault)
            await ClearDefaultAddress(dto.UserId);

        var address = new UserAddress
        {
            UserId = dto.UserId,
            Name = dto.Name,
            Street = dto.Street,
            City = dto.City,
            PostalCode = dto.PostalCode,
            Country = dto.Country,
            IsDefault = shouldBeDefault,
        };

        db.UserAddresses.Add(address);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = address.Id }, ToDto(address));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserAddressDto dto)
    {
        var address = await db.UserAddresses.FindAsync(id);
        if (address is null)
            return NotFound();

        if (dto.IsDefault)
            await ClearDefaultAddress(address.UserId);

        address.Name = dto.Name;
        address.Street = dto.Street;
        address.City = dto.City;
        address.PostalCode = dto.PostalCode;
        address.Country = dto.Country;
        address.IsDefault = dto.IsDefault;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var address = await db.UserAddresses.FindAsync(id);
        if (address is null)
            return NotFound();

        var userId = address.UserId;
        var wasDefault = address.IsDefault;

        db.UserAddresses.Remove(address);
        await db.SaveChangesAsync();

        if (wasDefault)
            await PromoteFirstAddress(userId);

        return NoContent();
    }

    private async Task ClearDefaultAddress(int userId)
    {
        var defaults = await db.UserAddresses
            .Where(a => a.UserId == userId && a.IsDefault)
            .ToListAsync();

        foreach (var address in defaults)
            address.IsDefault = false;
    }

    private async Task PromoteFirstAddress(int userId)
    {
        var nextAddress = await db.UserAddresses
            .Where(a => a.UserId == userId)
            .OrderBy(a => a.Id)
            .FirstOrDefaultAsync();

        if (nextAddress is null)
            return;

        nextAddress.IsDefault = true;
        await db.SaveChangesAsync();
    }

    private static UserAddressDto ToDto(UserAddress a) =>
        new()
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
