using RentIt.Server.Features.Auth.Messages.DTOs;
using RentIt.Server.Features.Auth.Providers;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Auth.Mappings;

public static class AuthMapper
{
    public static AuthResponseDto ToAuthResponse(User user, IJwtTokenProvider tokenProvider) =>
        new()
        {
            Token = tokenProvider.GenerateToken(user),
            UserId = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            AccountType = user.AccountType,
        };
}
