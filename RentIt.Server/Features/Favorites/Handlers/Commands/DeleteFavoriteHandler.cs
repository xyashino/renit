using MediatR;
using RentIt.Server.Data;
using RentIt.Server.Features.Favorites.Messages.Commands;

namespace RentIt.Server.Features.Favorites.Handlers.Commands;

public class DeleteFavoriteHandler : IRequestHandler<DeleteFavoriteCommand, Unit>
{
    private readonly AppDbContext _db;

    public DeleteFavoriteHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Unit> Handle(DeleteFavoriteCommand request, CancellationToken cancellationToken)
    {
        if (request.CurrentUserId is null)
            throw new UnauthorizedAccessException();

        var favorite = await _db.FavoriteEquipment.FindAsync(new object[] { request.CurrentUserId.Value, request.EquipmentId }, cancellationToken);
        if (favorite is null)
            throw new KeyNotFoundException($"Ulubiony sprzet {request.EquipmentId} nie istnieje");

        _db.FavoriteEquipment.Remove(favorite);
        await _db.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
