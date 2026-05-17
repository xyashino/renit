using RentIt.Server.Models;

namespace RentIt.Server.Features.Auth.Providers;

public interface IJwtTokenProvider
{
    string GenerateToken(User user);
}
