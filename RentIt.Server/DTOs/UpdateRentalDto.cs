using System.ComponentModel.DataAnnotations;
using RentIt.Server.Models;

namespace RentIt.Server.DTOs;

public sealed class UpdateRentalDto
{
    [Required]
    public DateTime DateFrom { get; set; }

    [Required]
    public DateTime DateTo { get; set; }

    public string Notes { get; set; } = string.Empty;

    [Required]
    public string Address { get; set; } = string.Empty;

    public int ClientId { get; set; }
    public int EquipmentId { get; set; }
    public int? UserAddressId { get; set; }
    public ItemStatus Status { get; set; }
}
