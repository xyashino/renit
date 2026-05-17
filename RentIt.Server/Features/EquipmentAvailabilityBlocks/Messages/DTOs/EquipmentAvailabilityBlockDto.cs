namespace RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.DTOs;

public sealed class EquipmentAvailabilityBlockDto
{
    public int Id { get; set; }
    public int EquipmentId { get; set; }
    public DateTime DateFrom { get; set; }
    public DateTime DateTo { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
