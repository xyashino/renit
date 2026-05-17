using System.ComponentModel.DataAnnotations;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Rentals.Messages.DTOs;

public sealed class UpdateRentalStatusDto
{
    [Required]
    public RentalStatus Status { get; set; }
}
