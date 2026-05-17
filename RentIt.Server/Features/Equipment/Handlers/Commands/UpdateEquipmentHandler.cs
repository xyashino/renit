using MediatR;
using RentIt.Server.Data;
using RentIt.Server.Features.Equipment.Messages.Commands;
using RentIt.Server.Features.Equipment.Providers;

namespace RentIt.Server.Features.Equipment.Handlers.Commands;

public class UpdateEquipmentHandler : IRequestHandler<UpdateEquipmentCommand, Unit>
{
    private readonly AppDbContext _db;
    private readonly IEquipmentCategorySync _categorySync;

    public UpdateEquipmentHandler(AppDbContext db, IEquipmentCategorySync categorySync)
    {
        _db = db;
        _categorySync = categorySync;
    }

    public async Task<Unit> Handle(UpdateEquipmentCommand request, CancellationToken cancellationToken)
    {
        var equipment = await _db.Equipment.FindAsync(new object[] { request.EquipmentId }, cancellationToken);
        if (equipment is null)
            throw new KeyNotFoundException($"Sprzet {request.EquipmentId} nie istnieje");

        if (request.CurrentUserId is null || request.CurrentUserId != equipment.UserId)
            throw new UnauthorizedAccessException();

        var dto = request.Dto;
        equipment.Name = dto.Name;
        equipment.Description = dto.Description;
        equipment.ImageUrl = dto.ImageUrl;
        equipment.PricePerDay = dto.PricePerDay;
        equipment.Deposit = dto.Deposit;
        equipment.Address = dto.Address?.Trim() ?? string.Empty;
        equipment.Status = dto.Status;

        await _db.SaveChangesAsync(cancellationToken);
        await _categorySync.SyncAsync(equipment.Id, dto.CategoryIds, cancellationToken);

        return Unit.Value;
    }
}
