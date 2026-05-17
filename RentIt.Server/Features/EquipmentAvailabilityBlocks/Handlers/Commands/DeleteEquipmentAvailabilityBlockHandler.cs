using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.Commands;

namespace RentIt.Server.Features.EquipmentAvailabilityBlocks.Handlers.Commands;

public class DeleteEquipmentAvailabilityBlockHandler : IRequestHandler<DeleteEquipmentAvailabilityBlockCommand, Unit>
{
    private readonly AppDbContext _db;

    public DeleteEquipmentAvailabilityBlockHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Unit> Handle(DeleteEquipmentAvailabilityBlockCommand request, CancellationToken cancellationToken)
    {
        var block = await _db.EquipmentAvailabilityBlocks
            .Include(b => b.Equipment)
            .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

        if (block is null)
            throw new KeyNotFoundException($"Blok dostepnosci {request.Id} nie istnieje");

        if (request.CurrentUserId is null || request.CurrentUserId != block.Equipment?.UserId)
            throw new UnauthorizedAccessException();

        _db.EquipmentAvailabilityBlocks.Remove(block);
        await _db.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
