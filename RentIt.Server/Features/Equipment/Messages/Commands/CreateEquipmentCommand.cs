using MediatR;
using RentIt.Server.Features.Equipment.Messages.DTOs;

namespace RentIt.Server.Features.Equipment.Messages.Commands;

public class CreateEquipmentCommand : IRequest<EquipmentDto>
{
    public int? CurrentUserId { get; set; }
    public CreateEquipmentDto Dto { get; set; }

    public CreateEquipmentCommand(int? currentUserId, CreateEquipmentDto dto)
    {
        CurrentUserId = currentUserId;
        Dto = dto;
    }
}
