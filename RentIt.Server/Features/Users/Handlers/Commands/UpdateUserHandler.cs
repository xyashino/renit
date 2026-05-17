using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.Users.Messages.Commands;

namespace RentIt.Server.Features.Users.Handlers.Commands;

public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, Unit>
{
    private readonly AppDbContext _db;

    public UpdateUserHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Unit> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        if (request.CurrentUserId is null || request.CurrentUserId != request.TargetId)
            throw new UnauthorizedAccessException();

        var user = await _db.Users.FindAsync(new object[] { request.TargetId }, cancellationToken);
        if (user is null)
            throw new KeyNotFoundException($"Uzytkownik {request.TargetId} nie istnieje");

        var dto = request.Dto;

        if (await _db.Users.AnyAsync(u => u.Id != request.TargetId && u.Email == dto.Email, cancellationToken))
            throw new InvalidOperationException("Email jest juz zajety");

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Email = dto.Email;

        await _db.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
