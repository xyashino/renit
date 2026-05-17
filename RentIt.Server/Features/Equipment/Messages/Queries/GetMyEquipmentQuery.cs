using MediatR;
using RentIt.Server.Features.Equipment.Messages.DTOs;

namespace RentIt.Server.Features.Equipment.Messages.Queries;

public class GetMyEquipmentQuery : IRequest<IEnumerable<EquipmentDto>>
{
    public int? CurrentUserId { get; set; }

    public GetMyEquipmentQuery(int? currentUserId)
    {
        CurrentUserId = currentUserId;
    }
}
