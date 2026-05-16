using Microsoft.EntityFrameworkCore;
using RentIt.Server.Models;

namespace RentIt.Server.Data;

public static class DbInitializer
{
    public const string DefaultPassword = "Test1234!";
    public const string OwnerEmail = "owner@test.pl";
    public const string ClientEmail = "client@test.pl";

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
        UpsertSeedUser(db, "Jan", "Właściciel", OwnerEmail, UserAccountType.Owner);
        UpsertSeedUser(db, "Anna", "Klient", ClientEmail, UserAccountType.Client);
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

        var owner = db.Users.FirstOrDefault(u => u.Email == OwnerEmail);
        if (owner is null)
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
                UserId = owner.Id,
                Status = ItemStatus.Rented,
            }, new[] { "electronics" }),
            (new Equipment
            {
                Name = "Dron DJI Mini 3",
                Description = "Dron z kamerą 4K, czas lotu do 38 minut. Idealny do filmowania z powietrza.",
                ImageUrl = "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 120m,
                Deposit = 800m,
                Address = "ul. Marszałkowska 1, Warszawa",
                UserId = owner.Id,
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
                UserId = owner.Id,
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
                UserId = owner.Id,
                Status = ItemStatus.Unavailable,
            }, new[] { "tools", "construction" }),
            (new Equipment
            {
                Name = "Betoniarka elektryczna 140L",
                Description = "Betoniarka elektryczna o pojemności 140 litrów, silnik 550W.",
                ImageUrl = "https://images.unsplash.com/photo-1599707254554-027aeb4deacd?auto=format&fit=crop&w=1200&q=80",
                PricePerDay = 60m,
                Deposit = 400m,
                Address = "ul. Marszałkowska 1, Warszawa",
                UserId = owner.Id,
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
                UserId = owner.Id,
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
                UserId = owner.Id,
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

        var client = db.Users.FirstOrDefault(u => u.Email == ClientEmail);
        if (client is null)
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
            NewRental(client.Id, canon, SeedUtcDate(-2), SeedUtcDate(3), RentalStatus.Active,
                "Aktywna rezerwacja — aparat w użyciu (status sprzętu: wypożyczony)."),
            NewRental(client.Id, drill, SeedUtcDate(7), SeedUtcDate(10), RentalStatus.Pending,
                "Oczekująca — remont łazienki, wiertarka na 3 dni."),
            NewRental(client.Id, bike, SeedUtcDate(-60), SeedUtcDate(-57), RentalStatus.Completed,
                "Zakończona — wycieczka w Bieszczady."),
            NewRental(client.Id, drone, SeedUtcDate(14), SeedUtcDate(17), RentalStatus.Cancelled,
                "Anulowana — zmiana planów podróży."),
            NewRental(client.Id, mixer, SeedUtcDate(-45), SeedUtcDate(-42), RentalStatus.Completed,
                "Zakończona — budowa tarasu."),
            NewRental(client.Id, canon, SeedUtcDate(-90), SeedUtcDate(-87), RentalStatus.Completed,
                "Zakończona — archiwalna sesja produktowa."),
            NewRental(client.Id, grinder, SeedUtcDate(-1), SeedUtcDate(4), RentalStatus.Active,
                "Aktywna — renowacja ogrodzenia (sprzęt niedostępny w katalogu)."),
            NewRental(client.Id, mower, SeedUtcDate(12), SeedUtcDate(15), RentalStatus.Pending,
                "Oczekująca — pierwsze koszenie sezonu."),
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
        var client = db.Users.FirstOrDefault(u => u.Email == ClientEmail);
        if (client is null)
            return;

        var equipment = EquipmentByName(db);

        var favoriteNames = new[]
        {
            "Aparat Canon EOS 90D",
            "Dron DJI Mini 3",
            "Rower górski Trek Marlin 7",
            "Wiertarko-wkrętarka Bosch GSR 18V",
        };

        foreach (var equipmentName in favoriteNames)
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
                Reason = "Serwis obiektywu (nakłada się na aktywną rezerwację testowo)",
                CreatedAt = DateTime.UtcNow,
            });

        db.SaveChanges();
    }
}
