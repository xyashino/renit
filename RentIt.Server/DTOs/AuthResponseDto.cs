namespace RentIt.Server.DTOs;

public record AuthResponseDto(
    string Token,
    int UserId,
    string Email,
    string FirstName,
    string LastName
);
