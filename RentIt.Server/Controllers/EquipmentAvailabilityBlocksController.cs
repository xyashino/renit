using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentIt.Server.Common;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.Commands;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.DTOs;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.Queries;

namespace RentIt.Server.Controllers;

[ApiController]
[Route("api/equipment-availability-blocks")]
public class EquipmentAvailabilityBlocksController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IEnumerable<EquipmentAvailabilityBlockDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] int? equipmentId)
        => Ok(await mediator.Send(new GetEquipmentAvailabilityBlocksQuery(equipmentId)));

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(EquipmentAvailabilityBlockDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            return Ok(await mediator.Send(new GetEquipmentAvailabilityBlockByIdQuery(id)));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(EquipmentAvailabilityBlockDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create([FromBody] CreateEquipmentAvailabilityBlockDto dto)
    {
        try
        {
            var created = await mediator.Send(new CreateEquipmentAvailabilityBlockCommand(User.GetUserId(), dto));
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEquipmentAvailabilityBlockDto dto)
    {
        try
        {
            await mediator.Send(new UpdateEquipmentAvailabilityBlockCommand(User.GetUserId(), id, dto));
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
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

    [HttpDelete("{id:int}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await mediator.Send(new DeleteEquipmentAvailabilityBlockCommand(User.GetUserId(), id));
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
