using RentIt.Server.Features.Equipment.Mappings;
using RentIt.Server.Features.Rentals.Messages.DTOs;
using RentIt.Server.Features.Users.Mappings;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Rentals.Mappings;

public static class RentalMapper
{
    public static RentalDto ToDto(Rental rental) =>
        new()
        {
            Id = rental.Id,
            DateFrom = rental.DateFrom,
            DateTo = rental.DateTo,
            Notes = rental.Notes,
            Address = rental.Address,
            ClientId = rental.ClientId,
            EquipmentId = rental.EquipmentId,
            Status = rental.Status,
            Client = rental.Client is null ? null : UserMapper.ToDto(rental.Client),
            Equipment = rental.Equipment is null ? null : EquipmentMapper.ToDto(rental.Equipment),
        };
}
