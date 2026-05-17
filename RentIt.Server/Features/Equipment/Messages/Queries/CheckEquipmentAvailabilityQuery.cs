using MediatR;
using RentIt.Server.Features.Equipment.Messages.DTOs;

namespace RentIt.Server.Features.Equipment.Messages.Queries;

public class CheckEquipmentAvailabilityQuery : IRequest<IEnumerable<BlockedRangeDto>>
{
    public int EquipmentId { get; set; }
    public DateTime DateFrom { get; set; }
    public DateTime DateTo { get; set; }

    public CheckEquipmentAvailabilityQuery(int equipmentId, DateTime dateFrom, DateTime dateTo)
    {
        EquipmentId = equipmentId;
        DateFrom = dateFrom;
        DateTo = dateTo;
    }
}
