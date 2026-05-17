using RentIt.Server.Models;

namespace RentIt.Server.Features.Users.Messages.DTOs;

public sealed class UserDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserAccountType AccountType { get; set; }
    public DateTime CreatedAt { get; set; }
}
