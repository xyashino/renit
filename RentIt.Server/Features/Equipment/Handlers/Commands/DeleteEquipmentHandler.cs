using MediatR;
using RentIt.Server.Data;
using RentIt.Server.Features.Equipment.Messages.Commands;

namespace RentIt.Server.Features.Equipment.Handlers.Commands;

public class DeleteEquipmentHandler : IRequestHandler<DeleteEquipmentCommand, Unit>
{
    private readonly AppDbContext _db;

    public DeleteEquipmentHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Unit> Handle(DeleteEquipmentCommand request, CancellationToken cancellationToken)
    {
        var equipment = await _db.Equipment.FindAsync(new object[] { request.EquipmentId }, cancellationToken);
        if (equipment is null)
            throw new KeyNotFoundException($"Sprzet {request.EquipmentId} nie istnieje");

        if (request.CurrentUserId is null || request.CurrentUserId != equipment.UserId)
            throw new UnauthorizedAccessException();

        _db.Equipment.Remove(equipment);
        await _db.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
