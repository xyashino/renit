using RentIt.Server.Features.Categories.Messages.DTOs;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Equipment.Messages.DTOs;

public sealed class EquipmentDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public decimal PricePerDay { get; set; }
    public decimal Deposit { get; set; }
    public string Address { get; set; } = string.Empty;
    public int UserId { get; set; }
    public ItemStatus Status { get; set; }
    public List<CategoryDto> Categories { get; set; } = new();
}
