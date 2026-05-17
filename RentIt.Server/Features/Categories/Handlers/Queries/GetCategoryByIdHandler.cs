using MediatR;
using RentIt.Server.Data;
using RentIt.Server.Features.Categories.Messages.DTOs;
using RentIt.Server.Features.Categories.Messages.Queries;

namespace RentIt.Server.Features.Categories.Handlers.Queries;

public class GetCategoryByIdHandler : IRequestHandler<GetCategoryByIdQuery, CategoryDto?>
{
    private readonly AppDbContext _db;

    public GetCategoryByIdHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<CategoryDto?> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var category = await _db.Categories.FindAsync(new object[] { request.Id }, cancellationToken);
        if (category is null)
        {
            return null;
        }

        return new CategoryDto { Id = category.Id, Name = category.Name, Key = category.Key };
    }
}
