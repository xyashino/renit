using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.Categories.Messages.DTOs;
using RentIt.Server.Features.Categories.Messages.Queries;

namespace RentIt.Server.Features.Categories.Handlers.Queries;

public class GetAllCategoriesHandler : IRequestHandler<GetAllCategoriesQuery, IEnumerable<CategoryDto>>
{
    private readonly AppDbContext _db;

    public GetAllCategoriesHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<CategoryDto>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
    {
        return await _db.Categories
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto { Id = c.Id, Name = c.Name, Key = c.Key })
            .ToListAsync(cancellationToken);
    }
}
