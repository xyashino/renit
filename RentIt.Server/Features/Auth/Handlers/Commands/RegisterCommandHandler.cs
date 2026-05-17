using MediatR;
using Microsoft.EntityFrameworkCore;
using RentIt.Server.Data;
using RentIt.Server.Features.Auth.Mappings;
using RentIt.Server.Features.Auth.Messages.Commands;
using RentIt.Server.Features.Auth.Messages.DTOs;
using RentIt.Server.Features.Auth.Providers;
using RentIt.Server.Models;

namespace RentIt.Server.Features.Auth.Handlers.Commands;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    private readonly AppDbContext _db;
    private readonly IJwtTokenProvider _tokenProvider;

    public RegisterCommandHandler(AppDbContext db, IJwtTokenProvider tokenProvider)
    {
        _db = db;
        _tokenProvider = tokenProvider;
    }

    public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Dto;

        if (await _db.Users.AnyAsync(u => u.Email == dto.Email, cancellationToken))
            throw new InvalidOperationException("Email jest już zajęty");

        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            AccountType = dto.AccountType,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync(cancellationToken);

        return AuthMapper.ToAuthResponse(user, _tokenProvider);
    }
}
