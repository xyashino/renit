using MediatR;
using RentIt.Server.Features.Users.Messages.DTOs;

namespace RentIt.Server.Features.Users.Messages.Commands;

public class UpdateUserCommand : IRequest<Unit>
{
    public int? CurrentUserId { get; set; }
    public int TargetId { get; set; }
    public UpdateUserDto Dto { get; set; }

    public UpdateUserCommand(int? currentUserId, int targetId, UpdateUserDto dto)
    {
        CurrentUserId = currentUserId;
        TargetId = targetId;
        Dto = dto;
    }
}
