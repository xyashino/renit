using MediatR;

namespace RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.Commands;

public class DeleteEquipmentAvailabilityBlockCommand : IRequest<Unit>
{
    public int? CurrentUserId { get; set; }
    public int Id { get; set; }

    public DeleteEquipmentAvailabilityBlockCommand(int? currentUserId, int id)
    {
        CurrentUserId = currentUserId;
        Id = id;
    }
}
