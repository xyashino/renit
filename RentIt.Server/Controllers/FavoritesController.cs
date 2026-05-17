using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentIt.Server.Common;
using RentIt.Server.Features.Favorites.Messages.Commands;
using RentIt.Server.Features.Favorites.Messages.DTOs;
using RentIt.Server.Features.Favorites.Messages.Queries;

namespace RentIt.Server.Controllers;

[ApiController]
[Authorize]
[Route("api/favorites")]
public class FavoritesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<FavoriteEquipmentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAll([FromQuery] int? equipmentId)
    {
        try
        {
            return Ok(await mediator.Send(new GetFavoritesQuery(User.GetUserId(), equipmentId)));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(FavoriteEquipmentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create([FromBody] CreateFavoriteEquipmentDto dto)
    {
        try
        {
            var created = await mediator.Send(new CreateFavoriteCommand(User.GetUserId(), dto));
            return CreatedAtAction(nameof(GetAll), new { equipmentId = created.EquipmentId }, created);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{equipmentId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int equipmentId)
    {
        try
        {
            await mediator.Send(new DeleteFavoriteCommand(User.GetUserId(), equipmentId));
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
