using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Equipment.Providers;

public class EquipmentCategorySync : IEquipmentCategorySync
{
    private readonly AppDbContext _db;

    public EquipmentCategorySync(AppDbContext db)
    {
        _db = db;
    }

    public async Task SyncAsync(int equipmentId, IEnumerable<int> categoryIds, CancellationToken cancellationToken)
    {
        var distinctIds = categoryIds.Distinct().ToList();

        var validIds = await _db.Categories
            .Where(c => distinctIds.Contains(c.Id))
            .Select(c => c.Id)
            .ToListAsync(cancellationToken);

        var existing = await _db.EquipmentCategories
            .Where(ec => ec.EquipmentId == equipmentId)
            .ToListAsync(cancellationToken);

        var toRemove = existing.Where(ec => !validIds.Contains(ec.CategoryId)).ToList();
        if (toRemove.Count > 0)
            _db.EquipmentCategories.RemoveRange(toRemove);

        var existingIds = existing.Select(ec => ec.CategoryId).ToHashSet();
        var toAdd = validIds
            .Where(id => !existingIds.Contains(id))
            .Select(categoryId => new EquipmentCategory { EquipmentId = equipmentId, CategoryId = categoryId });

        _db.EquipmentCategories.AddRange(toAdd);
        await _db.SaveChangesAsync(cancellationToken);
    }
}
