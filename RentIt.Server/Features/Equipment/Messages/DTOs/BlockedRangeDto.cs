using RentIt.Server.Models;

namespace RentIt.Server.Features.Equipment.Messages.DTOs;

public sealed class BlockedRangeDto
{
    public int? RentalId { get; set; }
    public int? AvailabilityBlockId { get; set; }
    public DateTime DateFrom { get; set; }
    public DateTime DateTo { get; set; }
    public RentalStatus? Status { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
}
