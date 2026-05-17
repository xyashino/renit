using MediatR;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.DTOs;

namespace RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.Queries;

public class GetEquipmentAvailabilityBlocksQuery : IRequest<IEnumerable<EquipmentAvailabilityBlockDto>>
{
    public int? EquipmentId { get; set; }

    public GetEquipmentAvailabilityBlocksQuery(int? equipmentId)
    {
        EquipmentId = equipmentId;
    }
}
