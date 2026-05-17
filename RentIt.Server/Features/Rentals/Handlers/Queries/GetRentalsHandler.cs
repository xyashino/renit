using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.Rentals.Mappings;
using RentIt.Server.Features.Rentals.Messages.DTOs;
using RentIt.Server.Features.Rentals.Messages.Queries;

namespace RentIt.Server.Features.Rentals.Handlers.Queries;

public class GetRentalsHandler : IRequestHandler<GetRentalsQuery, IEnumerable<RentalDto>>
{
    private readonly AppDbContext _db;

    public GetRentalsHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<RentalDto>> Handle(GetRentalsQuery request, CancellationToken cancellationToken)
    {
        if (request.CurrentUserId is null)
            throw new UnauthorizedAccessException();

        var meId = request.CurrentUserId.Value;

        var query = _db.Rentals
            .Include(r => r.Client)
            .Include(r => r.Equipment)
            .Where(r => r.ClientId == meId || r.Equipment!.UserId == meId);

        if (request.EquipmentId.HasValue)
        {
            var equipmentId = request.EquipmentId.Value;
            query = query.Where(r => r.EquipmentId == equipmentId);
        }

        var items = await query.ToListAsync(cancellationToken);
        return items.Select(RentalMapper.ToDto);
    }
}
