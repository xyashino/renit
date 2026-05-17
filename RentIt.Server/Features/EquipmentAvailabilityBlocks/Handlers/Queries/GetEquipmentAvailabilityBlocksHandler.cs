using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Mappings;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.DTOs;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.Queries;

namespace RentIt.Server.Features.EquipmentAvailabilityBlocks.Handlers.Queries;

public class GetEquipmentAvailabilityBlocksHandler : IRequestHandler<GetEquipmentAvailabilityBlocksQuery, IEnumerable<EquipmentAvailabilityBlockDto>>
{
    private readonly AppDbContext _db;

    public GetEquipmentAvailabilityBlocksHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<EquipmentAvailabilityBlockDto>> Handle(GetEquipmentAvailabilityBlocksQuery request, CancellationToken cancellationToken)
    {
        var query = _db.EquipmentAvailabilityBlocks.AsQueryable();

        if (request.EquipmentId.HasValue)
        {
            var equipmentId = request.EquipmentId.Value;
            query = query.Where(b => b.EquipmentId == equipmentId);
        }

        var blocks = await query
            .OrderBy(b => b.DateFrom)
            .ToListAsync(cancellationToken);

        return blocks.Select(EquipmentAvailabilityBlockMapper.ToDto);
    }
}
