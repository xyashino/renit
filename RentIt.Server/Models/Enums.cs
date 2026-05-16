namespace RentIt.Server.Models;

public enum ItemStatus
{
    Available = 1,
    Rented = 2,
    Unavailable = 3,
}

public enum UserAccountType
{
    Client = 0,
    Owner = 1,
}

public enum RentalStatus
{
    Pending = 0,
    Active = 1,
    Completed = 2,
    Cancelled = 3,
}
