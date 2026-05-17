using MediatR;
using RentIt.Server.Features.Categories.Messages.DTOs;

namespace RentIt.Server.Features.Categories.Messages.Queries;

public class GetAllCategoriesQuery : IRequest<IEnumerable<CategoryDto>>
{
}
