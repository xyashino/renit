using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.Equipment.Messages.DTOs;
using RentIt.Server.Features.Equipment.Messages.Queries;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Equipment.Handlers.Queries;

public class CheckEquipmentAvailabilityHandler : IRequestHandler<CheckEquipmentAvailabilityQuery, IEnumerable<BlockedRangeDto>>
{
    private readonly AppDbContext _db;

    public CheckEquipmentAvailabilityHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<BlockedRangeDto>> Handle(CheckEquipmentAvailabilityQuery request, CancellationToken cancellationToken)
    {
        if (request.DateFrom >= request.DateTo)
            throw new ArgumentException("dateFrom musi byc wczesniejsze niz dateTo");

        if (!await _db.Equipment.AnyAsync(e => e.Id == request.EquipmentId, cancellationToken))
            throw new KeyNotFoundException($"Sprzet {request.EquipmentId} nie istnieje");

        var rentalRanges = await _db.Rentals
            .Where(r =>
                r.EquipmentId == request.EquipmentId &&
                (r.Status == RentalStatus.Pending || r.Status == RentalStatus.Active) &&
                r.DateFrom < request.DateTo &&
                request.DateFrom < r.DateTo)
            .OrderBy(r => r.DateFrom)
            .Select(r => new BlockedRangeDto
            {
                RentalId = r.Id,
                DateFrom = r.DateFrom,
                DateTo = r.DateTo,
                Status = r.Status,
                Type = "rental",
            })
            .ToListAsync(cancellationToken);

        var availabilityBlocks = await _db.EquipmentAvailabilityBlocks
            .Where(b => b.EquipmentId == request.EquipmentId && b.DateFrom < request.DateTo && request.DateFrom < b.DateTo)
            .OrderBy(b => b.DateFrom)
            .Select(b => new BlockedRangeDto
            {
                AvailabilityBlockId = b.Id,
                DateFrom = b.DateFrom,
                DateTo = b.DateTo,
                Type = "availabilityBlock",
                Reason = b.Reason,
            })
            .ToListAsync(cancellationToken);

        IEnumerable<BlockedRangeDto> ranges = rentalRanges
            .Concat(availabilityBlocks)
            .OrderBy(r => r.DateFrom)
            .ToList();

        return ranges;
    }
}
