using MediatR;
using RentIt.Server.Data;
using RentIt.Server.Features.Users.Mappings;
using RentIt.Server.Features.Users.Messages.DTOs;
using RentIt.Server.Features.Users.Messages.Queries;

namespace RentIt.Server.Features.Users.Handlers.Queries;

public class GetUsersHandler : IRequestHandler<GetUsersQuery, IEnumerable<UserDto>>
{
    private readonly AppDbContext _db;

    public GetUsersHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<UserDto>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        if (request.CurrentUserId is null)
            throw new UnauthorizedAccessException();

        var me = await _db.Users.FindAsync(new object[] { request.CurrentUserId.Value }, cancellationToken);
        return me is null
            ? Array.Empty<UserDto>()
            : new[] { UserMapper.ToDto(me) };
    }
}
