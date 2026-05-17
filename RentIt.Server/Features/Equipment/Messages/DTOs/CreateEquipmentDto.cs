using System.ComponentModel.DataAnnotations;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Equipment.Messages.DTOs;

public sealed class CreateEquipmentDto
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

    public string? Address { get; set; }

    public ItemStatus Status { get; set; }
    public List<int> CategoryIds { get; set; } = new();
}
