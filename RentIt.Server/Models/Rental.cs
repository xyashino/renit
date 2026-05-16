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
    public RentalStatus Status { get; set; } = RentalStatus.Pending;

    public User? Client { get; set; }
    public Equipment? Equipment { get; set; }
}
