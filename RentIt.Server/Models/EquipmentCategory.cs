namespace RentIt.Server.Models;

public class EquipmentCategory
{
    public int EquipmentId { get; set; }
    public int CategoryId { get; set; }

    public Equipment? Equipment { get; set; }
    public Category? Category { get; set; }
}
