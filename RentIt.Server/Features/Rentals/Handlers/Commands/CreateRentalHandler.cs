using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.Rentals.Mappings;
using RentIt.Server.Features.Rentals.Messages.Commands;
using RentIt.Server.Features.Rentals.Messages.DTOs;
using RentIt.Server.Features.Rentals.Providers;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Rentals.Handlers.Commands;

public class CreateRentalHandler : IRequestHandler<CreateRentalCommand, RentalDto>
{
    private readonly AppDbContext _db;
    private readonly IRentalAvailabilityChecker _availabilityChecker;

    public CreateRentalHandler(AppDbContext db, IRentalAvailabilityChecker availabilityChecker)
    {
        _db = db;
        _availabilityChecker = availabilityChecker;
    }

    public async Task<RentalDto> Handle(CreateRentalCommand request, CancellationToken cancellationToken)
    {
        if (request.CurrentUserId is null)
            throw new UnauthorizedAccessException();

        var clientId = request.CurrentUserId.Value;
        var dto = request.Dto;

        var client = await _db.Users.FindAsync(new object[] { clientId }, cancellationToken);
        if (client is null || client.AccountType != UserAccountType.Client)
            throw new UnauthorizedAccessException();

        if (dto.DateFrom >= dto.DateTo)
            throw new ArgumentException("dateFrom musi byc wczesniejsze niz dateTo");

        var equipment = await _db.Equipment.FindAsync(new object[] { dto.EquipmentId }, cancellationToken);
        if (equipment is null)
            throw new ArgumentException("Sprzet nie istnieje");

        if (equipment.UserId == clientId)
            throw new ArgumentException("Nie mozesz wypozyczyc wlasnego sprzetu");

        if (await _availabilityChecker.HasConflictAsync(dto.EquipmentId, dto.DateFrom, dto.DateTo, null, cancellationToken))
            throw new ArgumentException("Sprzet nie jest dostepny w wybranym terminie");

        var rental = new Rental
        {
            DateFrom = dto.DateFrom,
            DateTo = dto.DateTo,
            Notes = dto.Notes,
            Address = equipment.Address,
            ClientId = clientId,
            EquipmentId = equipment.Id,
            Status = RentalStatus.Pending,
        };

        _db.Rentals.Add(rental);
        await _db.SaveChangesAsync(cancellationToken);

        var created = await _db.Rentals
            .Include(r => r.Client)
            .Include(r => r.Equipment)
            .FirstAsync(r => r.Id == rental.Id, cancellationToken);

        return RentalMapper.ToDto(created);
    }
}
