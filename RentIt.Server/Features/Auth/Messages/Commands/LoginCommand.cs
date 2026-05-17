using MediatR;
using RentIt.Server.Features.Auth.Messages.DTOs;

namespace RentIt.Server.Features.Auth.Messages.Commands;

public class LoginCommand : IRequest<AuthResponseDto>
{
    public LoginDto Dto { get; set; }

    public LoginCommand(LoginDto dto)
    {
        Dto = dto;
    }
}
