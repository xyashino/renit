using MediatR;
using RentIt.Server.Features.Rentals.Messages.DTOs;

namespace RentIt.Server.Features.Rentals.Messages.Commands;

public class UpdateRentalStatusCommand : IRequest<Unit>
{
    public int? CurrentUserId { get; set; }
    public int Id { get; set; }
    public UpdateRentalStatusDto Dto { get; set; }

    public UpdateRentalStatusCommand(int? currentUserId, int id, UpdateRentalStatusDto dto)
    {
        CurrentUserId = currentUserId;
        Id = id;
        Dto = dto;
    }
}
