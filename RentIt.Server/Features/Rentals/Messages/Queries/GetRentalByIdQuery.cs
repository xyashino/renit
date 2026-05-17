using MediatR;
using RentIt.Server.Features.Rentals.Messages.DTOs;

namespace RentIt.Server.Features.Rentals.Messages.Queries;

public class GetRentalByIdQuery : IRequest<RentalDto>
{
    public int? CurrentUserId { get; set; }
    public int Id { get; set; }

    public GetRentalByIdQuery(int? currentUserId, int id)
    {
        CurrentUserId = currentUserId;
        Id = id;
    }
}
