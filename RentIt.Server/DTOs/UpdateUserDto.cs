using System.ComponentModel.DataAnnotations;

namespace RentIt.Server.DTOs;

public record UpdateUserDto(
    [Required, MaxLength(100)] string FirstName,
    [Required, MaxLength(100)] string LastName,
    [Required, EmailAddress, MaxLength(256)] string Email,
    [Required] string Address
);
