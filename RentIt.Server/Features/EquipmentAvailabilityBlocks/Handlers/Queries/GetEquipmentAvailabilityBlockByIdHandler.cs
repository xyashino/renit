using MediatR;
using RentIt.Server.Data;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Mappings;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.DTOs;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.Queries;

namespace RentIt.Server.Features.EquipmentAvailabilityBlocks.Handlers.Queries;

public class GetEquipmentAvailabilityBlockByIdHandler : IRequestHandler<GetEquipmentAvailabilityBlockByIdQuery, EquipmentAvailabilityBlockDto>
{
    private readonly AppDbContext _db;

    public GetEquipmentAvailabilityBlockByIdHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<EquipmentAvailabilityBlockDto> Handle(GetEquipmentAvailabilityBlockByIdQuery request, CancellationToken cancellationToken)
    {
        var block = await _db.EquipmentAvailabilityBlocks.FindAsync(new object[] { request.Id }, cancellationToken);
        if (block is null)
            throw new KeyNotFoundException($"Blok dostepnosci {request.Id} nie istnieje");

        return EquipmentAvailabilityBlockMapper.ToDto(block);
    }
}
