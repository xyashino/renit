using MediatR;

namespace RentIt.Server.Features.Rentals.Messages.Commands;

public class DeleteRentalCommand : IRequest<Unit>
{
    public int? CurrentUserId { get; set; }
    public int Id { get; set; }

    public DeleteRentalCommand(int? currentUserId, int id)
    {
        CurrentUserId = currentUserId;
        Id = id;
    }
}
