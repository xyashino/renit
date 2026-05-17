using MediatR;
using RentIt.Server.Data;
using RentIt.Server.Features.Users.Mappings;
using RentIt.Server.Features.Users.Messages.DTOs;
using RentIt.Server.Features.Users.Messages.Queries;

namespace RentIt.Server.Features.Users.Handlers.Queries;

public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, UserDto>
{
    private readonly AppDbContext _db;

    public GetUserByIdHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<UserDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        if (request.CurrentUserId is null || request.CurrentUserId != request.TargetId)
            throw new UnauthorizedAccessException();

        var user = await _db.Users.FindAsync(new object[] { request.TargetId }, cancellationToken);
        if (user is null)
            throw new KeyNotFoundException($"Uzytkownik {request.TargetId} nie istnieje");

        return UserMapper.ToDto(user);
    }
}
