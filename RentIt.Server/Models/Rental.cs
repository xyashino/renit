namespace RentIt.Server.Models;

public class Rental
{
    public int Id { get; set; }
    public DateTime DateFrom { get; set; }
    public DateTime DateTo { get; set; }
    public string Notes { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public int ClientId { get; set; }
    public int EquipmentId { get; set; }
    public int? UserAddressId { get; set; }
    public ItemStatus Status { get; set; } = ItemStatus.Available;

    public User? Client { get; set; }
    public Equipment? Equipment { get; set; }
    public UserAddress? UserAddress { get; set; }
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
