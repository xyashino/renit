using MediatR;
using RentIt.Server.Data;
using RentIt.Server.Features.Rentals.Messages.Commands;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Rentals.Handlers.Commands;

public class DeleteRentalHandler : IRequestHandler<DeleteRentalCommand, Unit>
{
    private readonly AppDbContext _db;

    public DeleteRentalHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Unit> Handle(DeleteRentalCommand request, CancellationToken cancellationToken)
    {
        var rental = await _db.Rentals.FindAsync(new object[] { request.Id }, cancellationToken);
        if (rental is null)
            throw new KeyNotFoundException($"Rezerwacja {request.Id} nie istnieje");

        if (request.CurrentUserId is null || request.CurrentUserId != rental.ClientId)
            throw new UnauthorizedAccessException();

        if (rental.Status != RentalStatus.Pending && rental.Status != RentalStatus.Cancelled)
            throw new ArgumentException("Usun rezerwacje przed potwierdzeniem lub po anulowaniu");

        _db.Rentals.Remove(rental);
        await _db.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
