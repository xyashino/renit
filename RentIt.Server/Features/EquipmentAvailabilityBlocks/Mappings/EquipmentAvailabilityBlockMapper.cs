using RentIt.Server.Features.EquipmentAvailabilityBlocks.Messages.DTOs;
using RentIt.Server.Models;

namespace RentIt.Server.Features.EquipmentAvailabilityBlocks.Mappings;

public static class EquipmentAvailabilityBlockMapper
{
    public static EquipmentAvailabilityBlockDto ToDto(EquipmentAvailabilityBlock entity) =>
        new()
        {
            Id = entity.Id,
            EquipmentId = entity.EquipmentId,
            DateFrom = entity.DateFrom,
            DateTo = entity.DateTo,
            Reason = entity.Reason,
            CreatedAt = entity.CreatedAt,
        };
}
