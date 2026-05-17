using RentIt.Server.Features.Users.Messages.DTOs;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Users.Mappings;

public static class UserMapper
{
    public static UserDto ToDto(User user) =>
        new()
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            AccountType = user.AccountType,
            CreatedAt = user.CreatedAt,
        };
}
