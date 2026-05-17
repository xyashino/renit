using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.Favorites.Mappings;
using RentIt.Server.Features.Favorites.Messages.Commands;
using RentIt.Server.Features.Favorites.Messages.DTOs;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Favorites.Handlers.Commands;

public class CreateFavoriteHandler : IRequestHandler<CreateFavoriteCommand, FavoriteEquipmentDto>
{
    private readonly AppDbContext _db;

    public CreateFavoriteHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<FavoriteEquipmentDto> Handle(CreateFavoriteCommand request, CancellationToken cancellationToken)
    {
        if (request.CurrentUserId is null)
            throw new UnauthorizedAccessException();

        var userId = request.CurrentUserId.Value;
        var dto = request.Dto;

        var user = await _db.Users.FindAsync(new object[] { userId }, cancellationToken);
        if (user is null || user.AccountType != UserAccountType.Client)
            throw new UnauthorizedAccessException();

        if (!await _db.Equipment.AnyAsync(e => e.Id == dto.EquipmentId, cancellationToken))
            throw new ArgumentException("Sprzet nie istnieje");

        if (await _db.FavoriteEquipment.AnyAsync(f => f.UserId == userId && f.EquipmentId == dto.EquipmentId, cancellationToken))
            throw new InvalidOperationException("Sprzet jest juz w ulubionych");

        var favorite = new FavoriteEquipment
        {
            UserId = userId,
            EquipmentId = dto.EquipmentId,
        };

        _db.FavoriteEquipment.Add(favorite);
        await _db.SaveChangesAsync(cancellationToken);

        var created = await _db.FavoriteEquipment
            .Include(f => f.Equipment)
                .ThenInclude(e => e!.EquipmentCategories)
                    .ThenInclude(ec => ec.Category)
            .FirstAsync(f => f.UserId == userId && f.EquipmentId == dto.EquipmentId, cancellationToken);

        return FavoriteEquipmentMapper.ToDto(created);
    }
}
