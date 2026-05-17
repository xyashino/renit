using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.Equipment.Mappings;
using RentIt.Server.Features.Equipment.Messages.DTOs;
using RentIt.Server.Features.Equipment.Messages.Queries;

namespace RentIt.Server.Features.Equipment.Handlers.Queries;

public class GetEquipmentByIdHandler : IRequestHandler<GetEquipmentByIdQuery, EquipmentDto>
{
    private readonly AppDbContext _db;

    public GetEquipmentByIdHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<EquipmentDto> Handle(GetEquipmentByIdQuery request, CancellationToken cancellationToken)
    {
        var equipment = await _db.Equipment
            .Include(e => e.EquipmentCategories)
                .ThenInclude(ec => ec.Category)
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

        if (equipment is null)
            throw new KeyNotFoundException($"Sprzet {request.Id} nie istnieje");

        return EquipmentMapper.ToDto(equipment);
    }
}
