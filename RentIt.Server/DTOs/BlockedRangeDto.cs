using RentIt.Server.Models;

namespace RentIt.Server.DTOs;

public record BlockedRangeDto(int RentalId, DateTime DateFrom, DateTime DateTo, ItemStatus Status);
