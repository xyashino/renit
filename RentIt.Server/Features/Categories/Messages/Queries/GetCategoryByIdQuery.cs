using MediatR;
using RentIt.Server.Features.Categories.Messages.DTOs;

namespace RentIt.Server.Features.Categories.Messages.Queries;

public class GetCategoryByIdQuery : IRequest<CategoryDto?>
{
    public int Id { get; set; }

    public GetCategoryByIdQuery(int id)
    {
        Id = id;
    }
}
