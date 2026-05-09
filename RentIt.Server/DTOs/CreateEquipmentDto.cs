using System.ComponentModel.DataAnnotations;
using RentIt.Server.Models;

namespace RentIt.Server.DTOs;

public record CreateEquipmentDto(
    [Required, MaxLength(150)] string Name,
    string Description,
    [Url] string? ImageUrl,
    [Range(0.01, double.MaxValue)] decimal PricePerDay,
    [Range(0, double.MaxValue)] decimal Deposit,
    string Address,
    int UserId,
    EquipmentCategory Category,
    ItemStatus Status
);
