using Microsoft.EntityFrameworkCore;
using RentIt.Server.Models;

namespace RentIt.Server.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Equipment> Equipment => Set<Equipment>();
    public DbSet<Rental> Rentals => Set<Rental>();
    public DbSet<FavoriteEquipment> FavoriteEquipment => Set<FavoriteEquipment>();
    public DbSet<EquipmentAvailabilityBlock> EquipmentAvailabilityBlocks => Set<EquipmentAvailabilityBlock>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<EquipmentCategory> EquipmentCategories => Set<EquipmentCategory>();

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

        modelBuilder.Entity<FavoriteEquipment>(e =>
        {
            e.HasKey(f => new { f.UserId, f.EquipmentId });

            e.HasOne(f => f.User)
                .WithMany(u => u.FavoriteEquipment)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(f => f.Equipment)
                .WithMany(eq => eq.FavoritedByUsers)
                .HasForeignKey(f => f.EquipmentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<EquipmentAvailabilityBlock>(e =>
        {
            e.Property(b => b.Reason).HasMaxLength(300);

            e.HasOne(b => b.Equipment)
                .WithMany(eq => eq.AvailabilityBlocks)
                .HasForeignKey(b => b.EquipmentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Category>(e =>
        {
            e.Property(c => c.Name).HasMaxLength(100).IsRequired();
            e.Property(c => c.Key).HasMaxLength(50).IsRequired();
            e.HasIndex(c => c.Key).IsUnique();
            e.HasIndex(c => c.Name).IsUnique();
        });

        modelBuilder.Entity<EquipmentCategory>(e =>
        {
            e.HasKey(ec => new { ec.EquipmentId, ec.CategoryId });

            e.HasOne(ec => ec.Equipment)
                .WithMany(eq => eq.EquipmentCategories)
                .HasForeignKey(ec => ec.EquipmentId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(ec => ec.Category)
                .WithMany(c => c.EquipmentCategories)
                .HasForeignKey(ec => ec.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
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
    }
}
