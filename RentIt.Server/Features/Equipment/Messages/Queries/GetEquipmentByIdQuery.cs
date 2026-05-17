using MediatR;
using RentIt.Server.Features.Equipment.Messages.DTOs;

namespace RentIt.Server.Features.Equipment.Messages.Queries;

public class GetEquipmentByIdQuery : IRequest<EquipmentDto>
{
    public int Id { get; set; }

    public GetEquipmentByIdQuery(int id)
    {
        Id = id;
    }
}
