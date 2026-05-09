using System.ComponentModel.DataAnnotations;
using RentIt.Server.Models;

namespace RentIt.Server.DTOs;

public record UpdateRentalStatusDto([Required] ItemStatus Status);
