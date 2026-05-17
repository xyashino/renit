using MediatR;
using RentIt.Server.Features.Rentals.Messages.DTOs;

namespace RentIt.Server.Features.Rentals.Messages.Commands;

public class CreateRentalCommand : IRequest<RentalDto>
{
    public int? CurrentUserId { get; set; }
    public CreateRentalDto Dto { get; set; }

    public CreateRentalCommand(int? currentUserId, CreateRentalDto dto)
    {
        CurrentUserId = currentUserId;
        Dto = dto;
    }
}
