namespace RentIt.Server.Models;

public class Review
{
    public int Id { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int AuthorId { get; set; }
    public int EquipmentId { get; set; }
    public int RentalId { get; set; }

    public User? Author { get; set; }
    public Equipment? Equipment { get; set; }
    public Rental? Rental { get; set; }
}
