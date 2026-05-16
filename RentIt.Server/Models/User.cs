namespace RentIt.Server.Models;

public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserAccountType AccountType { get; set; } = UserAccountType.Client;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Equipment> EquipmentItems { get; set; } = new List<Equipment>();
    public ICollection<Rental> Rentals { get; set; } = new List<Rental>();
    public ICollection<FavoriteEquipment> FavoriteEquipment { get; set; } = new List<FavoriteEquipment>();
}
