namespace RentIt.Server.DTOs;

public sealed class CreateFavoriteEquipmentDto
{
    public int UserId { get; set; }
    public int EquipmentId { get; set; }
}
