using MediatR;
using RentIt.Server.Features.Auth.Messages.DTOs;

namespace RentIt.Server.Features.Auth.Messages.Commands;

public class RegisterCommand : IRequest<AuthResponseDto>
{
    public RegisterDto Dto { get; set; }

    public RegisterCommand(RegisterDto dto)
    {
        Dto = dto;
    }
}
