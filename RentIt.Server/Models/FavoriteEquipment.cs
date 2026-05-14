namespace RentIt.Server.Models;

public class FavoriteEquipment
{
    public int UserId { get; set; }
    public int EquipmentId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public Equipment? Equipment { get; set; }
}
