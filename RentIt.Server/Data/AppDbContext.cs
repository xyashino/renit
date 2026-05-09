using Microsoft.EntityFrameworkCore;
using RentIt.Server.Models;

namespace RentIt.Server.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Equipment> Equipment => Set<Equipment>();
    public DbSet<Rental> Rentals => Set<Rental>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Email).HasMaxLength(256);
            e.Property(u => u.FirstName).HasMaxLength(100);
            e.Property(u => u.LastName).HasMaxLength(100);
        });

        modelBuilder.Entity<Equipment>(e =>
        {
            e.Property(eq => eq.Name).HasMaxLength(150);
            e.Property(eq => eq.PricePerDay).HasPrecision(18, 2);
            e.Property(eq => eq.Deposit).HasPrecision(18, 2);

            e.HasOne(eq => eq.Owner)
                .WithMany(u => u.EquipmentItems)
                .HasForeignKey(eq => eq.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Rental>(e =>
        {
            e.HasOne(r => r.Client)
                .WithMany(u => u.Rentals)
                .HasForeignKey(r => r.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(r => r.Equipment)
                .WithMany(eq => eq.Rentals)
                .HasForeignKey(r => r.EquipmentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Review>(e =>
        {
            e.HasOne(r => r.Author)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(r => r.Equipment)
                .WithMany(eq => eq.Reviews)
                .HasForeignKey(r => r.EquipmentId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(r => r.Rental)
                .WithMany(rt => rt.Reviews)
                .HasForeignKey(r => r.RentalId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
