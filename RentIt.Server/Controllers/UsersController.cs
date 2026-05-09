using Microsoft.AspNetCore.Mvc;
using RentIt.Server.Data;
using RentIt.Server.DTOs;
using RentIt.Server.Models;

namespace RentIt.Server.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController(AppDbContext db) : ControllerBase
{
    [HttpGet("{id:int}")]
    public async Task<ActionResult<object>> GetById(int id)
    {
        var user = await db.Users.FindAsync(id);
        return user is null ? NotFound() : Ok(ToDto(user));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null)
            return NotFound();

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Email = dto.Email;
        user.Address = dto.Address;

        await db.SaveChangesAsync();
        return NoContent();
    }

    private static object ToDto(User u) => new
    {
        u.Id,
        u.FirstName,
        u.LastName,
        u.Email,
        u.Address,
        u.CreatedAt,
    };
}
