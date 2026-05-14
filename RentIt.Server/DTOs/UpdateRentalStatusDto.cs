using System.ComponentModel.DataAnnotations;
using RentIt.Server.Models;

namespace RentIt.Server.DTOs;

public sealed class UpdateRentalStatusDto
{
    [Required]
    public ItemStatus Status { get; set; }
}
