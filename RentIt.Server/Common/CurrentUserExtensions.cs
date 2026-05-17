using System.Security.Claims;

namespace RentIt.Server.Common;

public static class CurrentUserExtensions
{
    public static int? GetUserId(this ClaimsPrincipal user)
    {
        var raw = user.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(raw, out var id) ? id : null;
    }
}
