using System.ComponentModel.DataAnnotations;
using RentIt.Server.Models;

namespace RentIt.Server.DTOs;

public sealed class UpdateEquipmentDto
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Url]
    public string? ImageUrl { get; set; }

    [Range(0.01, double.MaxValue)]
    public decimal PricePerDay { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Deposit { get; set; }

    [Required]
    public string Address { get; set; } = string.Empty;

    public int UserId { get; set; }
    public EquipmentCategory Category { get; set; }
    public ItemStatus Status { get; set; }
}
