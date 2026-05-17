using RentIt.Server.Features.Equipment.Messages.DTOs;
using RentIt.Server.Features.Users.Messages.DTOs;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Rentals.Messages.DTOs;

public sealed class RentalDto
{
    public int Id { get; set; }
    public DateTime DateFrom { get; set; }
    public DateTime DateTo { get; set; }
    public string Notes { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int ClientId { get; set; }
    public int EquipmentId { get; set; }
    public RentalStatus Status { get; set; }
    public UserDto? Client { get; set; }
    public EquipmentDto? Equipment { get; set; }
}
