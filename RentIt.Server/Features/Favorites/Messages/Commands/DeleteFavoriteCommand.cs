using MediatR;

namespace RentIt.Server.Features.Favorites.Messages.Commands;

public class DeleteFavoriteCommand : IRequest<Unit>
{
    public int? CurrentUserId { get; set; }
    public int EquipmentId { get; set; }

    public DeleteFavoriteCommand(int? currentUserId, int equipmentId)
    {
        CurrentUserId = currentUserId;
        EquipmentId = equipmentId;
    }
}
