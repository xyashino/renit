using MediatR;
using RentIt.Server.Features.Users.Messages.DTOs;

namespace RentIt.Server.Features.Users.Messages.Queries;

public class GetUserByIdQuery : IRequest<UserDto>
{
    public int? CurrentUserId { get; set; }
    public int TargetId { get; set; }

    public GetUserByIdQuery(int? currentUserId, int targetId)
    {
        CurrentUserId = currentUserId;
        TargetId = targetId;
    }
}
