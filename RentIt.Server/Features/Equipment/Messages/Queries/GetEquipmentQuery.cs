using MediatR;
using RentIt.Server.Features.Equipment.Messages.DTOs;

namespace RentIt.Server.Features.Equipment.Messages.Queries;

public class GetEquipmentQuery : IRequest<IEnumerable<EquipmentDto>>
{
    public string? City { get; set; }
    public int? CategoryId { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }

    public GetEquipmentQuery(string? city, int? categoryId, DateTime? dateFrom, DateTime? dateTo)
    {
        City = city;
        CategoryId = categoryId;
        DateFrom = dateFrom;
        DateTo = dateTo;
    }
}
