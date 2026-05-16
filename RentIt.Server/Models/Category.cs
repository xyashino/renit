namespace RentIt.Server.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;

    public ICollection<EquipmentCategory> EquipmentCategories { get; set; } = new List<EquipmentCategory>();
}
