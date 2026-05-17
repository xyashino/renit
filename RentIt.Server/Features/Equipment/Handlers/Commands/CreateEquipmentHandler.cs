using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.Equipment.Mappings;
using RentIt.Server.Features.Equipment.Messages.Commands;
using RentIt.Server.Features.Equipment.Messages.DTOs;
using RentIt.Server.Features.Equipment.Providers;
using RentIt.Server.Models;
using EquipmentEntity = RentIt.Server.Models.Equipment;

namespace RentIt.Server.Features.Equipment.Handlers.Commands;

public class CreateEquipmentHandler : IRequestHandler<CreateEquipmentCommand, EquipmentDto>
{
    private readonly AppDbContext _db;
    private readonly IEquipmentCategorySync _categorySync;

    public CreateEquipmentHandler(AppDbContext db, IEquipmentCategorySync categorySync)
    {
        _db = db;
        _categorySync = categorySync;
    }

    public async Task<EquipmentDto> Handle(CreateEquipmentCommand request, CancellationToken cancellationToken)
    {
        if (request.CurrentUserId is null)
            throw new UnauthorizedAccessException();

        var owner = await _db.Users.FindAsync(new object[] { request.CurrentUserId.Value }, cancellationToken);
        if (owner is null || owner.AccountType != UserAccountType.Owner)
            throw new UnauthorizedAccessException();

        var dto = request.Dto;
        var equipment = new EquipmentEntity
        {
            Name = dto.Name,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            PricePerDay = dto.PricePerDay,
            Deposit = dto.Deposit,
            Address = dto.Address?.Trim() ?? string.Empty,
            UserId = request.CurrentUserId.Value,
            Status = dto.Status,
        };

        _db.Equipment.Add(equipment);
        await _db.SaveChangesAsync(cancellationToken);

        await _categorySync.SyncAsync(equipment.Id, dto.CategoryIds, cancellationToken);

        var created = await _db.Equipment
            .Include(e => e.EquipmentCategories)
                .ThenInclude(ec => ec.Category)
            .FirstAsync(e => e.Id == equipment.Id, cancellationToken);

        return EquipmentMapper.ToDto(created);
    }
}
