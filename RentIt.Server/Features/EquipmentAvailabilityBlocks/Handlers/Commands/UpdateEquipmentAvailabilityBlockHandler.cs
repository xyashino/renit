using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.Commands;

namespace RentIt.Server.Features.EquipmentAvailabilityBlocks.Handlers.Commands;

public class UpdateEquipmentAvailabilityBlockHandler : IRequestHandler<UpdateEquipmentAvailabilityBlockCommand, Unit>
{
    private readonly AppDbContext _db;

    public UpdateEquipmentAvailabilityBlockHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Unit> Handle(UpdateEquipmentAvailabilityBlockCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Dto;

        if (dto.DateFrom >= dto.DateTo)
            throw new ArgumentException("dateFrom musi byc wczesniejsze niz dateTo");

        var block = await _db.EquipmentAvailabilityBlocks
            .Include(b => b.Equipment)
            .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

        if (block is null)
            throw new KeyNotFoundException($"Blok dostepnosci {request.Id} nie istnieje");

        if (request.CurrentUserId is null || request.CurrentUserId != block.Equipment?.UserId)
            throw new UnauthorizedAccessException();

        block.DateFrom = dto.DateFrom;
        block.DateTo = dto.DateTo;
        block.Reason = dto.Reason;

        await _db.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
