using MediatR;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.DTOs;

namespace RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.Queries;

public class GetEquipmentAvailabilityBlockByIdQuery : IRequest<EquipmentAvailabilityBlockDto>
{
    public int Id { get; set; }

    public GetEquipmentAvailabilityBlockByIdQuery(int id)
    {
        Id = id;
    }
}
