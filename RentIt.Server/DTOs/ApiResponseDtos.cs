using RentIt.Server.Models;

namespace RentIt.Server.DTOs;

public sealed class ErrorResponseDto
{
    public string Message { get; set; } = string.Empty;
}

public sealed class UserDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserAccountType AccountType { get; set; }
    public DateTime CreatedAt { get; set; }
}

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

public sealed class FavoriteEquipmentDto
{
    public int UserId { get; set; }
    public int EquipmentId { get; set; }
    public DateTime CreatedAt { get; set; }
    public EquipmentDto? Equipment { get; set; }
}

public sealed class EquipmentAvailabilityBlockDto
{
    public int Id { get; set; }
    public int EquipmentId { get; set; }
    public DateTime DateFrom { get; set; }
    public DateTime DateTo { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public sealed class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
}
