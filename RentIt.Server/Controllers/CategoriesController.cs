using MediatR;
using Microsoft.AspNetCore.Mvc;
using RentIt.Server.Features.Categories.Messages.DTOs;
using RentIt.Server.Features.Categories.Messages.Queries;

namespace RentIt.Server.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
        => Ok(await mediator.Send(new GetAllCategoriesQuery()));

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(CategoryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await mediator.Send(new GetCategoryByIdQuery(id));
        return category is null ? NotFound() : Ok(category);
    }
}
