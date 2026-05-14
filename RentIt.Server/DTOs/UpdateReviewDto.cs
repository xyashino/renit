using System.ComponentModel.DataAnnotations;

namespace RentIt.Server.DTOs;

public sealed class UpdateReviewDto
{
    [Range(1, 5)]
    public int Rating { get; set; }

    [Required]
    public string Comment { get; set; } = string.Empty;

    public int AuthorId { get; set; }
    public int EquipmentId { get; set; }
    public int RentalId { get; set; }
}
