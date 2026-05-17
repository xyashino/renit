using MediatR;
using RentIt.Server.Features.Equipment.Messages.DTOs;

namespace RentIt.Server.Features.Equipment.Messages.Commands;

public class UpdateEquipmentCommand : IRequest<Unit>
{
    public int? CurrentUserId { get; set; }
    public int EquipmentId { get; set; }
    public UpdateEquipmentDto Dto { get; set; }

    public UpdateEquipmentCommand(int? currentUserId, int equipmentId, UpdateEquipmentDto dto)
    {
        CurrentUserId = currentUserId;
        EquipmentId = equipmentId;
        Dto = dto;
    }
}
