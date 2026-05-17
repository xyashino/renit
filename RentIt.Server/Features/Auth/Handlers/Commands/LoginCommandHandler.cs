using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.Auth.Mappings;
using RentIt.Server.Features.Auth.Messages.Commands;
using RentIt.Server.Features.Auth.Messages.DTOs;
using RentIt.Server.Features.Auth.Providers;

namespace RentIt.Server.Features.Auth.Handlers.Commands;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponseDto>
{
    private readonly AppDbContext _db;
    private readonly IJwtTokenProvider _tokenProvider;

    public LoginCommandHandler(AppDbContext db, IJwtTokenProvider tokenProvider)
    {
        _db = db;
        _tokenProvider = tokenProvider;
    }

    public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Dto;

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email, cancellationToken);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Nieprawidłowy email lub hasło");

        return AuthMapper.ToAuthResponse(user, _tokenProvider);
    }
}
