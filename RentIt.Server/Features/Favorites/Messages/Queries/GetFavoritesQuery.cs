using MediatR;
using RentIt.Server.Features.Favorites.Messages.DTOs;

namespace RentIt.Server.Features.Favorites.Messages.Queries;

public class GetFavoritesQuery : IRequest<IEnumerable<FavoriteEquipmentDto>>
{
    public int? CurrentUserId { get; set; }
    public int? EquipmentId { get; set; }

    public GetFavoritesQuery(int? currentUserId, int? equipmentId)
    {
        CurrentUserId = currentUserId;
        EquipmentId = equipmentId;
    }
}
