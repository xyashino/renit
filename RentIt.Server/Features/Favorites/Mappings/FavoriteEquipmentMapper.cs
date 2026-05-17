using RentIt.Server.Features.Equipment.Mappings;
using RentIt.Server.Features.Favorites.Messages.DTOs;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Favorites.Mappings;

public static class FavoriteEquipmentMapper
{
    public static FavoriteEquipmentDto ToDto(FavoriteEquipment favorite) =>
        new()
        {
            UserId = favorite.UserId,
            EquipmentId = favorite.EquipmentId,
            CreatedAt = favorite.CreatedAt,
            Equipment = favorite.Equipment is null ? null : EquipmentMapper.ToDto(favorite.Equipment),
        };
}
