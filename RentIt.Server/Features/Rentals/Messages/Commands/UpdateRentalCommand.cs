using MediatR;
using RentIt.Server.Features.Rentals.Messages.DTOs;

namespace RentIt.Server.Features.Rentals.Messages.Commands;

public class UpdateRentalCommand : IRequest<Unit>
{
    public int? CurrentUserId { get; set; }
    public int Id { get; set; }
    public UpdateRentalDto Dto { get; set; }

    public UpdateRentalCommand(int? currentUserId, int id, UpdateRentalDto dto)
    {
        CurrentUserId = currentUserId;
        Id = id;
        Dto = dto;
    }
}
