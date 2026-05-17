using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.Favorites.Mappings;
using RentIt.Server.Features.Favorites.Messages.DTOs;
using RentIt.Server.Features.Favorites.Messages.Queries;

namespace RentIt.Server.Features.Favorites.Handlers.Queries;

public class GetFavoritesHandler : IRequestHandler<GetFavoritesQuery, IEnumerable<FavoriteEquipmentDto>>
{
    private readonly AppDbContext _db;

    public GetFavoritesHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<FavoriteEquipmentDto>> Handle(GetFavoritesQuery request, CancellationToken cancellationToken)
    {
        if (request.CurrentUserId is null)
            throw new UnauthorizedAccessException();

        var meId = request.CurrentUserId.Value;

        var query = _db.FavoriteEquipment
            .Include(f => f.Equipment)
                .ThenInclude(e => e!.EquipmentCategories)
                    .ThenInclude(ec => ec.Category)
            .Where(f => f.UserId == meId);

        if (request.EquipmentId.HasValue)
        {
            var equipmentId = request.EquipmentId.Value;
            query = query.Where(f => f.EquipmentId == equipmentId);
        }

        var favorites = await query
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync(cancellationToken);

        return favorites.Select(FavoriteEquipmentMapper.ToDto);
    }
}
