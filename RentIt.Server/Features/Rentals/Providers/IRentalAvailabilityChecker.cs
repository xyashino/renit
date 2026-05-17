namespace RentIt.Server.Features.Rentals.Providers;

public interface IRentalAvailabilityChecker
{
    Task<bool> HasConflictAsync(
        int equipmentId,
        DateTime dateFrom,
        DateTime dateTo,
        int? ignoredRentalId,
        CancellationToken cancellationToken);
}
