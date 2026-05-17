using MediatR;
using RentIt.Server.Data;
using RentIt.Server.Features.Users.Messages.Commands;

namespace RentIt.Server.Features.Users.Handlers.Commands;

public class DeleteUserHandler : IRequestHandler<DeleteUserCommand, Unit>
{
    private readonly AppDbContext _db;

    public DeleteUserHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        if (request.CurrentUserId is null || request.CurrentUserId != request.TargetId)
            throw new UnauthorizedAccessException();

        var user = await _db.Users.FindAsync(new object[] { request.TargetId }, cancellationToken);
        if (user is null)
            throw new KeyNotFoundException($"Uzytkownik {request.TargetId} nie istnieje");

        _db.Users.Remove(user);
        await _db.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
