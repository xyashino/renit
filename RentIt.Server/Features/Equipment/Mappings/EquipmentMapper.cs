using RentIt.Server.Features.Categories.Messages.DTOs;
using RentIt.Server.Features.Equipment.Messages.DTOs;
using EquipmentEntity = RentIt.Server.Models.Equipment;

namespace RentIt.Server.Features.Equipment.Mappings;

public static class EquipmentMapper
{
    public static EquipmentDto ToDto(EquipmentEntity entity) =>
        new()
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            ImageUrl = entity.ImageUrl,
            PricePerDay = entity.PricePerDay,
            Deposit = entity.Deposit,
            Address = entity.Address,
            UserId = entity.UserId,
            Status = entity.Status,
            Categories = entity.EquipmentCategories
                .Where(ec => ec.Category is not null)
                .Select(ec => new CategoryDto
                {
                    Id = ec.Category!.Id,
                    Name = ec.Category.Name,
                    Key = ec.Category.Key,
                })
                .ToList(),
        };
}
