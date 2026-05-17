using MediatR;

namespace RentIt.Server.Features.Equipment.Messages.Commands;

public class DeleteEquipmentCommand : IRequest<Unit>
{
    public int? CurrentUserId { get; set; }
    public int EquipmentId { get; set; }

    public DeleteEquipmentCommand(int? currentUserId, int equipmentId)
    {
        CurrentUserId = currentUserId;
        EquipmentId = equipmentId;
    }
}
