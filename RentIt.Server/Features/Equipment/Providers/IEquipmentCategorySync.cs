namespace RentIt.Server.Features.Equipment.Providers;

public interface IEquipmentCategorySync
{
    Task SyncAsync(int equipmentId, IEnumerable<int> categoryIds, CancellationToken cancellationToken);
}
