using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.Rentals.Messages.Commands;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Rentals.Handlers.Commands;

public class UpdateRentalStatusHandler : IRequestHandler<UpdateRentalStatusCommand, Unit>
{
    private readonly AppDbContext _db;

    public UpdateRentalStatusHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Unit> Handle(UpdateRentalStatusCommand request, CancellationToken cancellationToken)
    {
        var rental = await _db.Rentals
            .Include(r => r.Equipment)
            .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

        if (rental is null)
            throw new KeyNotFoundException($"Rezerwacja {request.Id} nie istnieje");

        if (request.CurrentUserId is null)
            throw new UnauthorizedAccessException();

        var ownerId = rental.Equipment?.UserId;
        var isOwner = ownerId == request.CurrentUserId;
        var isClient = rental.ClientId == request.CurrentUserId;

        if (!isOwner && !isClient)
            throw new UnauthorizedAccessException();

        if (!IsTransitionAllowed(rental.Status, request.Dto.Status, isOwner, isClient))
            throw new ArgumentException("Niedozwolone przejscie statusu");

        rental.Status = request.Dto.Status;
        await _db.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    private static bool IsTransitionAllowed(RentalStatus current, RentalStatus next, bool isOwner, bool isClient) =>
        (current, next) switch
        {
            (RentalStatus.Pending, RentalStatus.Active) => isOwner,
            (RentalStatus.Active, RentalStatus.Completed) => isOwner,
            (RentalStatus.Pending, RentalStatus.Cancelled) => isClient || isOwner,
            (RentalStatus.Active, RentalStatus.Cancelled) => isClient || isOwner,
            _ => false,
        };
}
