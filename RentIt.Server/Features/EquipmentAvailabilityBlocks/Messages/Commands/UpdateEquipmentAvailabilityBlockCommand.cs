using MediatR;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.DTOs;

namespace RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.Commands;

public class UpdateEquipmentAvailabilityBlockCommand : IRequest<Unit>
{
    public int? CurrentUserId { get; set; }
    public int Id { get; set; }
    public UpdateEquipmentAvailabilityBlockDto Dto { get; set; }

    public UpdateEquipmentAvailabilityBlockCommand(int? currentUserId, int id, UpdateEquipmentAvailabilityBlockDto dto)
    {
        CurrentUserId = currentUserId;
        Id = id;
        Dto = dto;
    }
}
