using MediatR;
using RentIt.Server.Data;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Mappings;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.Commands;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.DTOs;
using RentIt.Server.Models;

namespace RentIt.Server.Features.EquipmentAvailabilityBlocks.Handlers.Commands;

public class CreateEquipmentAvailabilityBlockHandler : IRequestHandler<CreateEquipmentAvailabilityBlockCommand, EquipmentAvailabilityBlockDto>
{
    private readonly AppDbContext _db;

    public CreateEquipmentAvailabilityBlockHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<EquipmentAvailabilityBlockDto> Handle(CreateEquipmentAvailabilityBlockCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Dto;

        if (dto.DateFrom >= dto.DateTo)
            throw new ArgumentException("dateFrom musi byc wczesniejsze niz dateTo");

        var equipment = await _db.Equipment.FindAsync(new object[] { dto.EquipmentId }, cancellationToken);
        if (equipment is null)
            throw new ArgumentException("Sprzet nie istnieje");

        if (request.CurrentUserId is null || request.CurrentUserId != equipment.UserId)
            throw new UnauthorizedAccessException();

        var block = new EquipmentAvailabilityBlock
        {
            EquipmentId = dto.EquipmentId,
            DateFrom = dto.DateFrom,
            DateTo = dto.DateTo,
            Reason = dto.Reason,
        };

        _db.EquipmentAvailabilityBlocks.Add(block);
        await _db.SaveChangesAsync(cancellationToken);

        return EquipmentAvailabilityBlockMapper.ToDto(block);
    }
}
