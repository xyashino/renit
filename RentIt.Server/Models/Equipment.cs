namespace RentIt.Server.Models;

public class Equipment
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public decimal PricePerDay { get; set; }
    public decimal Deposit { get; set; }

    public string Address { get; set; } = string.Empty;

    public int UserId { get; set; }
    public EquipmentCategory Category { get; set; } = EquipmentCategory.Electronics;
    public ItemStatus Status { get; set; } = ItemStatus.Available;

    public User? Owner { get; set; }
    public ICollection<Rental> Rentals { get; set; } = new List<Rental>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
