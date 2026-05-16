using Microsoft.EntityFrameworkCore;
using RentIt.Server.Models;

namespace RentIt.Server.Data;

public static class DbInitializer
{
    private const string DefaultPassword = "Test1234!";

    private static readonly (string Key, string Name)[] SeedCategoryDefinitions =
    [
        ("electronics", "Elektronika"),
        ("tools", "Narzędzia"),
        ("construction", "Budownictwo"),
        ("garden", "Ogrody"),
        ("sports-and-recreation", "Sport i rekreacja"),
    ];

    public static void Seed(AppDbContext db)
    {
        SeedUsers(db);
        SeedCategories(db);
        SeedEquipment(db);
        SeedRentals(db);
        SeedFavorites(db);
        SeedAvailabilityBlocks(db);
    }

    private static void SeedUsers(AppDbContext db)
    {
        UpsertSeedUser(db, "Jan", "Kowalski", "jan@rentit.pl", UserAccountType.Owner);
        UpsertSeedUser(db, "Anna", "Nowak", "anna@rentit.pl", UserAccountType.Owner);
        UpsertSeedUser(db, "Piotr", "Wisniewski", "piotr@rentit.pl", UserAccountType.Client);
        UpsertSeedUser(db, "Maria", "Lewandowska", "maria@rentit.pl", UserAccountType.Client);

        db.SaveChanges();
    }

    private static void UpsertSeedUser(
        AppDbContext db,
        string firstName,
        string lastName,
        string email,
        UserAccountType accountType
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
                AccountType = accountType,
                CreatedAt = DateTime.UtcNow,
            });
            return;
        }

        user.FirstName = firstName;
        user.LastName = lastName;
        user.AccountType = accountType;
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(DefaultPassword);
    }

    private static void SeedCategories(AppDbContext db)
    {
        foreach (var (key, name) in SeedCategoryDefinitions)
        {
            var existing = db.Categories.FirstOrDefault(c => c.Key == key);
            if (existing is null)
            {
                db.Categories.Add(new Category { Key = key, Name = name });
                continue;
            }

            existing.Name = name;
        }

        db.SaveChanges();
    }

    private static void SeedEquipment(AppDbContext db)
    {
        if (db.Equipment.Any()) return;

        var jan = db.Users.FirstOrDefault(u => u.Email == "jan@rentit.pl");
        var anna = db.Users.FirstOrDefault(u => u.Email == "anna@rentit.pl");

        if (jan is null || anna is null)
            return;

        var categoriesByKey = db.Categories.ToDictionary(c => c.Key, c => c.Id);

        var seed = new (Equipment Item, string[] CategoryKeys)[]
        {
            (new Equipment
            {
                Name = "Aparat Canon EOS 90D",
                Description = "Lustrzanka cyfrowa z obiektywem 18-55mm, idealna do fotografii portretowej i krajobrazowej.",
                ImageUrl = "https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 80m,
                Deposit = 500m,
                Address = "ul. Marszałkowska 1, Warszawa",
                UserId = jan.Id,
                Status = ItemStatus.Available,
            }, new[] { "electronics" }),
            (new Equipment
            {
                Name = "Dron DJI Mini 3",
                Description = "Dron z kamerą 4K, czas lotu do 38 minut. Idealny do filmowania z powietrza.",
                ImageUrl = "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 120m,
                Deposit = 800m,
                Address = "ul. Marszałkowska 1, Warszawa",
                UserId = jan.Id,
                Status = ItemStatus.Available,
            }, new[] { "electronics" }),
            (new Equipment
            {
                Name = "Wiertarko-wkrętarka Bosch GSR 18V",
                Description = "Akumulatorowa wiertarko-wkrętarka 18V z dwoma akumulatorami i walizką.",
                ImageUrl = "https://images.unsplash.com/photo-1581147036324-c1c0e2c0d78f?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 25m,
                Deposit = 150m,
                Address = "ul. Floriańska 5, Kraków",
                UserId = anna.Id,
                Status = ItemStatus.Available,
            }, new[] { "tools" }),
            (new Equipment
            {
                Name = "Szlifierka kątowa Makita 230mm",
                Description = "Szlifierka kątowa 2000W do cięcia i szlifowania metalu i betonu.",
                ImageUrl = "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 30m,
                Deposit = 200m,
                Address = "ul. Floriańska 5, Kraków",
                UserId = anna.Id,
                Status = ItemStatus.Available,
            }, new[] { "tools", "construction" }),
            (new Equipment
            {
                Name = "Betoniarka elektryczna 140L",
                Description = "Betoniarka elektryczna o pojemności 140 litrów, silnik 550W.",
                ImageUrl = "https://images.unsplash.com/photo-1599707254554-027aeb4deacd?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 60m,
                Deposit = 400m,
                Address = "ul. Marszałkowska 1, Warszawa",
                UserId = jan.Id,
                Status = ItemStatus.Available,
            }, new[] { "construction" }),
            (new Equipment
            {
                Name = "Kosiarka spalinowa Honda HRX 476",
                Description = "Kosiarka z napędem na tylne koła, szerokość koszenia 47cm, pojemnik 70L.",
                ImageUrl = "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 45m,
                Deposit = 300m,
                Address = "ul. Floriańska 5, Kraków",
                UserId = anna.Id,
                Status = ItemStatus.Available,
            }, new[] { "garden" }),
            (new Equipment
            {
                Name = "Rower górski Trek Marlin 7",
                Description = "Rower górski 29\", amortyzator przedni, przerzutki Shimano Deore 12-biegowe.",
                ImageUrl = "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 50m,
                Deposit = 350m,
                Address = "ul. Marszałkowska 1, Warszawa",
                UserId = jan.Id,
                Status = ItemStatus.Available,
            }, new[] { "sports-and-recreation" }),
        };

        foreach (var (item, _) in seed)
            db.Equipment.Add(item);

        db.SaveChanges();

        foreach (var (item, categoryKeys) in seed)
        {
            foreach (var categoryKey in categoryKeys)
            {
                if (!categoriesByKey.TryGetValue(categoryKey, out var categoryId))
                    continue;

                db.EquipmentCategories.Add(new EquipmentCategory
                {
                    EquipmentId = item.Id,
                    CategoryId = categoryId,
                });
            }
        }

        db.SaveChanges();
    }

    private static DateTime SeedUtcDate(int daysFromToday) =>
        DateTime.SpecifyKind(DateTime.UtcNow.Date.AddDays(daysFromToday), DateTimeKind.Utc);

    private static void SeedRentals(AppDbContext db)
    {
        if (db.Rentals.Any())
            return;

        var piotr = db.Users.FirstOrDefault(u => u.Email == "piotr@rentit.pl");
        var maria = db.Users.FirstOrDefault(u => u.Email == "maria@rentit.pl");
        if (piotr is null || maria is null)
            return;

        var equipment = EquipmentByName(db);

        if (!TryGetEquipment(equipment, "Aparat Canon EOS 90D", out var canon) ||
            !TryGetEquipment(equipment, "Dron DJI Mini 3", out var drone) ||
            !TryGetEquipment(equipment, "Wiertarko-wkrętarka Bosch GSR 18V", out var drill) ||
            !TryGetEquipment(equipment, "Szlifierka kątowa Makita 230mm", out var grinder) ||
            !TryGetEquipment(equipment, "Betoniarka elektryczna 140L", out var mixer) ||
            !TryGetEquipment(equipment, "Kosiarka spalinowa Honda HRX 476", out var mower) ||
            !TryGetEquipment(equipment, "Rower górski Trek Marlin 7", out var bike))
            return;

        var rentals = new[]
        {
            NewRental(piotr.Id, canon, SeedUtcDate(-2), SeedUtcDate(3), RentalStatus.Active,
                "Sesja zdjęciowa w weekend — proszę o wcześniejszy odbiór."),
            NewRental(piotr.Id, drill, SeedUtcDate(7), SeedUtcDate(10), RentalStatus.Pending,
                "Remont łazienki, potrzebuję wiertarki na 3 dni."),
            NewRental(piotr.Id, bike, SeedUtcDate(-60), SeedUtcDate(-57), RentalStatus.Completed,
                "Wycieczka w Bieszczady."),
            NewRental(piotr.Id, drone, SeedUtcDate(14), SeedUtcDate(17), RentalStatus.Cancelled,
                "Anulowane — zmiana planów podróży."),
            NewRental(piotr.Id, mixer, SeedUtcDate(-45), SeedUtcDate(-42), RentalStatus.Completed,
                "Budowa tarasu — bez opinii (do testu formularza)."),
            NewRental(piotr.Id, canon, SeedUtcDate(-90), SeedUtcDate(-87), RentalStatus.Completed,
                "Sesja produktowa — archiwalna."),
            NewRental(maria.Id, grinder, SeedUtcDate(-1), SeedUtcDate(4), RentalStatus.Active,
                "Renowacja ogrodzenia — szlifierka na 5 dni."),
            NewRental(maria.Id, mower, SeedUtcDate(12), SeedUtcDate(15), RentalStatus.Pending,
                "Pierwsze koszenie sezonu."),
            NewRental(maria.Id, canon, SeedUtcDate(-75), SeedUtcDate(-72), RentalStatus.Completed,
                "Materiały promocyjne do social mediów."),
            NewRental(maria.Id, grinder, SeedUtcDate(-30), SeedUtcDate(-27), RentalStatus.Completed,
                "Renowacja ogrodzenia — zakończone przed bieżącą aktywną rezerwacją."),
        };

        db.Rentals.AddRange(rentals);
        db.SaveChanges();
    }

    private static Rental NewRental(
        int clientId,
        Equipment equipment,
        DateTime dateFrom,
        DateTime dateTo,
        RentalStatus status,
        string notes) =>
        new()
        {
            ClientId = clientId,
            EquipmentId = equipment.Id,
            DateFrom = dateFrom,
            DateTo = dateTo,
            Notes = notes,
            Address = equipment.Address,
            Status = status,
        };

    private static Dictionary<string, Equipment> EquipmentByName(AppDbContext db) =>
        db.Equipment
            .AsEnumerable()
            .GroupBy(e => e.Name)
            .ToDictionary(g => g.Key, g => g.First());

    private static bool TryGetEquipment(
        IReadOnlyDictionary<string, Equipment> byName,
        string name,
        out Equipment equipment) =>
        byName.TryGetValue(name, out equipment!);

    private static void SeedFavorites(AppDbContext db)
    {
        var piotr = db.Users.FirstOrDefault(u => u.Email == "piotr@rentit.pl");
        var maria = db.Users.FirstOrDefault(u => u.Email == "maria@rentit.pl");
        if (piotr is null || maria is null)
            return;

        var equipment = EquipmentByName(db);

        var favoriteSpecs = new (string ClientEmail, string[] EquipmentNames)[]
        {
            ("piotr@rentit.pl", new[]
            {
                "Aparat Canon EOS 90D",
                "Dron DJI Mini 3",
                "Rower górski Trek Marlin 7",
            }),
            ("maria@rentit.pl", new[]
            {
                "Wiertarko-wkrętarka Bosch GSR 18V",
                "Kosiarka spalinowa Honda HRX 476",
                "Betoniarka elektryczna 140L",
            }),
        };

        foreach (var (clientEmail, equipmentNames) in favoriteSpecs)
        {
            var client = db.Users.First(u => u.Email == clientEmail);

            foreach (var equipmentName in equipmentNames)
            {
                if (!equipment.TryGetValue(equipmentName, out var item))
                    continue;

                var exists = db.FavoriteEquipment.Any(f =>
                    f.UserId == client.Id && f.EquipmentId == item.Id);

                if (exists)
                    continue;

                db.FavoriteEquipment.Add(new FavoriteEquipment
                {
                    UserId = client.Id,
                    EquipmentId = item.Id,
                    CreatedAt = DateTime.UtcNow.AddDays(-7),
                });
            }
        }

        db.SaveChanges();
    }

    private static void SeedAvailabilityBlocks(AppDbContext db)
    {
        if (db.EquipmentAvailabilityBlocks.Any())
            return;

        var equipment = EquipmentByName(db);

        if (!TryGetEquipment(equipment, "Dron DJI Mini 3", out var drone) ||
            !TryGetEquipment(equipment, "Betoniarka elektryczna 140L", out var mixer) ||
            !TryGetEquipment(equipment, "Aparat Canon EOS 90D", out var canon))
            return;

        db.EquipmentAvailabilityBlocks.AddRange(
            new EquipmentAvailabilityBlock
            {
                EquipmentId = drone.Id,
                DateFrom = SeedUtcDate(20),
                DateTo = SeedUtcDate(25),
                Reason = "Kalibracja GPS i przegląd techniczny",
                CreatedAt = DateTime.UtcNow,
            },
            new EquipmentAvailabilityBlock
            {
                EquipmentId = mixer.Id,
                DateFrom = SeedUtcDate(30),
                DateTo = SeedUtcDate(45),
                Reason = "Wynajem długoterminowy poza aplikacją",
                CreatedAt = DateTime.UtcNow,
            },
            new EquipmentAvailabilityBlock
            {
                EquipmentId = canon.Id,
                DateFrom = SeedUtcDate(10),
                DateTo = SeedUtcDate(13),
                Reason = "Serwis obiektywu",
                CreatedAt = DateTime.UtcNow,
            });

        db.SaveChanges();
    }
}
