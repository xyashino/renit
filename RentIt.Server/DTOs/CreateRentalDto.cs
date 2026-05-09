using System.ComponentModel.DataAnnotations;
using RentIt.Server.Models;

namespace RentIt.Server.DTOs;

public record CreateRentalDto(
    [Required] DateTime DateFrom,
    [Required] DateTime DateTo,
    string Notes,
    string Address,
    int ClientId,
    int EquipmentId,
    ItemStatus Status
);
