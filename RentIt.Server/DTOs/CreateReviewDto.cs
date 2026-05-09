using System.ComponentModel.DataAnnotations;

namespace RentIt.Server.DTOs;

public record CreateReviewDto(
    [Range(1, 5)] int Rating,
    string Comment,
    int AuthorId,
    int EquipmentId,
    int RentalId
);
