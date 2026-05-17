using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Rentals.Providers;

public class RentalAvailabilityChecker : IRentalAvailabilityChecker
{
    private readonly AppDbContext _db;

    public RentalAvailabilityChecker(AppDbContext db)
    {
        _db = db;
    }

    public async Task<bool> HasConflictAsync(
        int equipmentId,
        DateTime dateFrom,
        DateTime dateTo,
        int? ignoredRentalId,
        CancellationToken cancellationToken)
    {
        var rentalConflict = await _db.Rentals.AnyAsync(r =>
            r.EquipmentId == equipmentId &&
            (!ignoredRentalId.HasValue || r.Id != ignoredRentalId.Value) &&
            (r.Status == RentalStatus.Pending || r.Status == RentalStatus.Active) &&
            r.DateFrom < dateTo &&
            dateFrom < r.DateTo,
            cancellationToken);

        if (rentalConflict)
            return true;

        return await _db.EquipmentAvailabilityBlocks.AnyAsync(b =>
            b.EquipmentId == equipmentId &&
            b.DateFrom < dateTo &&
            dateFrom < b.DateTo,
            cancellationToken);
    }
}
