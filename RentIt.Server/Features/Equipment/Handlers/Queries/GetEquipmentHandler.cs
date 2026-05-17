using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.Equipment.Mappings;
using RentIt.Server.Features.Equipment.Messages.DTOs;
using RentIt.Server.Features.Equipment.Messages.Queries;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Equipment.Handlers.Queries;

public class GetEquipmentHandler : IRequestHandler<GetEquipmentQuery, IEnumerable<EquipmentDto>>
{
    private readonly AppDbContext _db;

    public GetEquipmentHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<EquipmentDto>> Handle(GetEquipmentQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Equipment
            .Include(e => e.EquipmentCategories)
                .ThenInclude(ec => ec.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.City))
        {
            var pattern = $"%{request.City.Trim()}%";
            query = query.Where(e => EF.Functions.Like(e.Address, pattern));
        }

        if (request.CategoryId.HasValue)
        {
            var categoryId = request.CategoryId.Value;
            query = query.Where(e => e.EquipmentCategories.Any(ec => ec.CategoryId == categoryId));
        }

        if (request.DateFrom.HasValue && request.DateTo.HasValue)
        {
            var dateFrom = request.DateFrom.Value;
            var dateTo = request.DateTo.Value;

            query = query.Where(e =>
                !e.Rentals.Any(r =>
                    (r.Status == RentalStatus.Pending || r.Status == RentalStatus.Active) &&
                    r.DateFrom < dateTo && dateFrom < r.DateTo) &&
                !e.AvailabilityBlocks.Any(b => b.DateFrom < dateTo && dateFrom < b.DateTo));
        }

        var items = await query.ToListAsync(cancellationToken);
        return items.Select(EquipmentMapper.ToDto);
    }
}
