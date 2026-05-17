using MediatR;
using RentIt.Server.Features.Favorites.Messages.DTOs;

namespace RentIt.Server.Features.Favorites.Messages.Commands;

public class CreateFavoriteCommand : IRequest<FavoriteEquipmentDto>
{
    public int? CurrentUserId { get; set; }
    public CreateFavoriteEquipmentDto Dto { get; set; }

    public CreateFavoriteCommand(int? currentUserId, CreateFavoriteEquipmentDto dto)
    {
        CurrentUserId = currentUserId;
        Dto = dto;
    }
}
