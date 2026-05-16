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
    public ItemStatus Status { get; set; } = ItemStatus.Available;

    public User? Owner { get; set; }
    public ICollection<Rental> Rentals { get; set; } = new List<Rental>();
    public ICollection<FavoriteEquipment> FavoritedByUsers { get; set; } = new List<FavoriteEquipment>();
    public ICollection<EquipmentAvailabilityBlock> AvailabilityBlocks { get; set; } = new List<EquipmentAvailabilityBlock>();
    public ICollection<EquipmentCategory> EquipmentCategories { get; set; } = new List<EquipmentCategory>();
}
