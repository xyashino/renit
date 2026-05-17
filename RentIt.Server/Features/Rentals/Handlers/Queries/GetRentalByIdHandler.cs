using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.Rentals.Mappings;
using RentIt.Server.Features.Rentals.Messages.DTOs;
using RentIt.Server.Features.Rentals.Messages.Queries;

namespace RentIt.Server.Features.Rentals.Handlers.Queries;

public class GetRentalByIdHandler : IRequestHandler<GetRentalByIdQuery, RentalDto>
{
    private readonly AppDbContext _db;

    public GetRentalByIdHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<RentalDto> Handle(GetRentalByIdQuery request, CancellationToken cancellationToken)
    {
        var rental = await _db.Rentals
            .Include(r => r.Client)
            .Include(r => r.Equipment)
            .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

        if (rental is null)
            throw new KeyNotFoundException($"Rezerwacja {request.Id} nie istnieje");

        if (request.CurrentUserId is null
            || (request.CurrentUserId != rental.ClientId && request.CurrentUserId != rental.Equipment?.UserId))
            throw new UnauthorizedAccessException();

        return RentalMapper.ToDto(rental);
    }
}
