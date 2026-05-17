using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.Equipment.Mappings;
using RentIt.Server.Features.Equipment.Messages.DTOs;
using RentIt.Server.Features.Equipment.Messages.Queries;

namespace RentIt.Server.Features.Equipment.Handlers.Queries;

public class GetMyEquipmentHandler : IRequestHandler<GetMyEquipmentQuery, IEnumerable<EquipmentDto>>
{
    private readonly AppDbContext _db;

    public GetMyEquipmentHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<EquipmentDto>> Handle(GetMyEquipmentQuery request, CancellationToken cancellationToken)
    {
        if (request.CurrentUserId is null)
            throw new UnauthorizedAccessException();

        var ownerId = request.CurrentUserId.Value;

        var items = await _db.Equipment
            .Include(e => e.EquipmentCategories)
                .ThenInclude(ec => ec.Category)
            .Where(e => e.UserId == ownerId)
            .OrderByDescending(e => e.Id)
            .ToListAsync(cancellationToken);

        return items.Select(EquipmentMapper.ToDto);
    }
}
