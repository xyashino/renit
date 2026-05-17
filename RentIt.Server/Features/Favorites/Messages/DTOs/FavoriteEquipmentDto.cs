using RentIt.Server.Features.Equipment.Messages.DTOs;

namespace RentIt.Server.Features.Favorites.Messages.DTOs;

public sealed class FavoriteEquipmentDto
{
    public int UserId { get; set; }
    public int EquipmentId { get; set; }
    public DateTime CreatedAt { get; set; }
    public EquipmentDto? Equipment { get; set; }
}
