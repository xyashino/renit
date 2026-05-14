using System.ComponentModel.DataAnnotations;

namespace RentIt.Server.DTOs;

public sealed class UpdateEquipmentAvailabilityBlockDto
{
    [Required]
    public DateTime DateFrom { get; set; }

    [Required]
    public DateTime DateTo { get; set; }

    [MaxLength(300)]
    public string Reason { get; set; } = string.Empty;
}
