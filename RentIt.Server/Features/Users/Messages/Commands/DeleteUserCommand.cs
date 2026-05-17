using MediatR;

namespace RentIt.Server.Features.Users.Messages.Commands;

public class DeleteUserCommand : IRequest<Unit>
{
    public int? CurrentUserId { get; set; }
    public int TargetId { get; set; }

    public DeleteUserCommand(int? currentUserId, int targetId)
    {
        CurrentUserId = currentUserId;
        TargetId = targetId;
    }
}
