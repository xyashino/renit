namespace RentIt.Server.Features.Categories.Messages.DTOs;

public sealed class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
}
