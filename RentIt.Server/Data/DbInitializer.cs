using RentIt.Server.Models;

namespace RentIt.Server.Data;

public static class DbInitializer
{
    private const string DefaultPassword = "Test1234!";

    public static void Seed(AppDbContext db)
    {
        SeedUsers(db);
        SeedEquipment(db);
    }

    private static void SeedUsers(AppDbContext db)
    {
        UpsertSeedUser(
            db,
            "Jan",
            "Kowalski",
            "jan@rentit.pl",
            "ul. Marszałkowska 1, Warszawa"
        );
        UpsertSeedUser(
            db,
            "Anna",
            "Nowak",
            "anna@rentit.pl",
            "ul. Floriańska 5, Kraków"
        );

        db.SaveChanges();
    }

    private static void UpsertSeedUser(
        AppDbContext db,
        string firstName,
        string lastName,
        string email,
        string address
    )
    {
        var user = db.Users.FirstOrDefault(u => u.Email == email);

        if (user is null)
        {
            db.Users.Add(new User
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(DefaultPassword),
                Address = address,
                CreatedAt = DateTime.UtcNow,
            });
            return;
        }

        user.FirstName = firstName;
        user.LastName = lastName;
        user.Address = address;
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(DefaultPassword);
    }

    private static void SeedEquipment(AppDbContext db)
    {
        if (db.Equipment.Any()) return;

        var jan = db.Users.FirstOrDefault(u => u.Email == "jan@rentit.pl");
        var anna = db.Users.FirstOrDefault(u => u.Email == "anna@rentit.pl");

        if (jan is null || anna is null)
            return;

        db.Equipment.AddRange(
            new Equipment
            {
                Name = "Aparat Canon EOS 90D",
                Description = "Lustrzanka cyfrowa z obiektywem 18-55mm, idealna do fotografii portretowej i krajobrazowej.",
                ImageUrl = "https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 80m,
                Deposit = 500m,
                Address = "ul. Marszałkowska 1, Warszawa",
                UserId = jan.Id,
                Category = EquipmentCategory.Electronics,
                Status = ItemStatus.Available,
            },
            new Equipment
            {
                Name = "Dron DJI Mini 3",
                Description = "Dron z kamerą 4K, czas lotu do 38 minut. Idealny do filmowania z powietrza.",
                ImageUrl = "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 120m,
                Deposit = 800m,
                Address = "ul. Marszałkowska 1, Warszawa",
                UserId = jan.Id,
                Category = EquipmentCategory.Electronics,
                Status = ItemStatus.Available,
            },
            new Equipment
            {
                Name = "Wiertarko-wkrętarka Bosch GSR 18V",
                Description = "Akumulatorowa wiertarko-wkrętarka 18V z dwoma akumulatorami i walizką.",
                ImageUrl = "https://images.unsplash.com/photo-1581147036324-c1c0e2c0d78f?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 25m,
                Deposit = 150m,
                Address = "ul. Floriańska 5, Kraków",
                UserId = anna.Id,
                Category = EquipmentCategory.Tools,
                Status = ItemStatus.Available,
            },
            new Equipment
            {
                Name = "Szlifierka kątowa Makita 230mm",
                Description = "Szlifierka kątowa 2000W do cięcia i szlifowania metalu i betonu.",
                ImageUrl = "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 30m,
                Deposit = 200m,
                Address = "ul. Floriańska 5, Kraków",
                UserId = anna.Id,
                Category = EquipmentCategory.Tools,
                Status = ItemStatus.Available,
            },
            new Equipment
            {
                Name = "Betoniarka elektryczna 140L",
                Description = "Betoniarka elektryczna o pojemności 140 litrów, silnik 550W.",
                ImageUrl = "https://images.unsplash.com/photo-1599707254554-027aeb4deacd?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 60m,
                Deposit = 400m,
                Address = "ul. Marszałkowska 1, Warszawa",
                UserId = jan.Id,
                Category = EquipmentCategory.Construction,
                Status = ItemStatus.Available,
            },
            new Equipment
            {
                Name = "Kosiarka spalinowa Honda HRX 476",
                Description = "Kosiarka z napędem na tylne koła, szerokość koszenia 47cm, pojemnik 70L.",
                ImageUrl = "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 45m,
                Deposit = 300m,
                Address = "ul. Floriańska 5, Kraków",
                UserId = anna.Id,
                Category = EquipmentCategory.Garden,
                Status = ItemStatus.Available,
            },
            new Equipment
            {
                Name = "Rower górski Trek Marlin 7",
                Description = "Rower górski 29\", amortyzator przedni, przerzutki Shimano Deore 12-biegowe.",
                ImageUrl = "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 50m,
                Deposit = 350m,
                Address = "ul. Marszałkowska 1, Warszawa",
                UserId = jan.Id,
                Category = EquipmentCategory.SportsAndRecreation,
                Status = ItemStatus.Available,
            }
        );

        db.SaveChanges();
    }
}
