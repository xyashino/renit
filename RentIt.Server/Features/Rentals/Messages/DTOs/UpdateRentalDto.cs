using System.ComponentModel.DataAnnotations;

namespace RentIt.Server.Features.Rentals.Messages.DTOs;

public sealed class UpdateRentalDto
{
    [Required]
    public DateTime DateFrom { get; set; }

    [Required]
    public DateTime DateTo { get; set; }

    public string Notes { get; set; } = string.Empty;
}
