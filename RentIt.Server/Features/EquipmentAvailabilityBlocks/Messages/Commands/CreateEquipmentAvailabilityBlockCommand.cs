using MediatR;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.DTOs;

namespace RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.Commands;

public class CreateEquipmentAvailabilityBlockCommand : IRequest<EquipmentAvailabilityBlockDto>
{
    public int? CurrentUserId { get; set; }
    public CreateEquipmentAvailabilityBlockDto Dto { get; set; }

    public CreateEquipmentAvailabilityBlockCommand(int? currentUserId, CreateEquipmentAvailabilityBlockDto dto)
    {
        CurrentUserId = currentUserId;
        Dto = dto;
    }
}
