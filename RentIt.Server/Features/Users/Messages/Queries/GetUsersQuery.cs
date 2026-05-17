using MediatR;
using RentIt.Server.Features.Users.Messages.DTOs;

namespace RentIt.Server.Features.Users.Messages.Queries;

public class GetUsersQuery : IRequest<IEnumerable<UserDto>>
{
    public int? CurrentUserId { get; set; }

    public GetUsersQuery(int? currentUserId)
    {
        CurrentUserId = currentUserId;
    }
}
