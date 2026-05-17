using MediatR;
using RentIt.Server.Data;
using RentIt.Server.Features.Rentals.Messages.Commands;
using RentIt.Server.Features.Rentals.Providers;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Rentals.Handlers.Commands;

public class UpdateRentalHandler : IRequestHandler<UpdateRentalCommand, Unit>
{
    private readonly AppDbContext _db;
    private readonly IRentalAvailabilityChecker _availabilityChecker;

    public UpdateRentalHandler(AppDbContext db, IRentalAvailabilityChecker availabilityChecker)
    {
        _db = db;
        _availabilityChecker = availabilityChecker;
    }

    public async Task<Unit> Handle(UpdateRentalCommand request, CancellationToken cancellationToken)
    {
        var rental = await _db.Rentals.FindAsync(new object[] { request.Id }, cancellationToken);
        if (rental is null)
            throw new KeyNotFoundException($"Rezerwacja {request.Id} nie istnieje");

        if (request.CurrentUserId is null || request.CurrentUserId != rental.ClientId)
            throw new UnauthorizedAccessException();

        if (rental.Status != RentalStatus.Pending)
            throw new ArgumentException("Edycja jest mozliwa tylko dla oczekujacych rezerwacji");

        var dto = request.Dto;

        if (dto.DateFrom >= dto.DateTo)
            throw new ArgumentException("dateFrom musi byc wczesniejsze niz dateTo");

        if (await _availabilityChecker.HasConflictAsync(rental.EquipmentId, dto.DateFrom, dto.DateTo, request.Id, cancellationToken))
            throw new ArgumentException("Sprzet nie jest dostepny w wybranym terminie");

        rental.DateFrom = dto.DateFrom;
        rental.DateTo = dto.DateTo;
        rental.Notes = dto.Notes;

        await _db.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
