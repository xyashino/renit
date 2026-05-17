using MediatR;
using RentIt.Server.Features.Rentals.Messages.DTOs;

namespace RentIt.Server.Features.Rentals.Messages.Queries;

public class GetRentalsQuery : IRequest<IEnumerable<RentalDto>>
{
    public int? CurrentUserId { get; set; }
    public int? EquipmentId { get; set; }

    public GetRentalsQuery(int? currentUserId, int? equipmentId)
    {
        CurrentUserId = currentUserId;
        EquipmentId = equipmentId;
    }
}
