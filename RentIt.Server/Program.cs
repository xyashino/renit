using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RentIt.Server.Data;
using System.Text;

namespace RentIt.Server;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        RegisterDbContext(builder);
        RegisterAuthenticationAndAuthorization(builder);
        RegisterControllersAndOpenApi(builder);
        SetUpCorsPolicy(builder);

        var app = builder.Build();
        ConfigureDevelopment(app);

        app.UseCors("AllowAll");
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();
        app.Run();
    }

    private static void RegisterControllersAndOpenApi(WebApplicationBuilder builder)
    {
        builder.Services.AddControllers();
        builder.Services.AddOpenApi();
    }

    private static void RegisterDbContext(WebApplicationBuilder builder)
    {
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
    }

    private static void RegisterAuthenticationAndAuthorization(WebApplicationBuilder builder)
    {
        var jwtKey = builder.Configuration["Jwt:Key"]!;

        builder.Services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                };
            });

        builder.Services.AddAuthorization();
    }

    private static void SetUpCorsPolicy(WebApplicationBuilder builder)
    {
        var configuredOrigins = builder.Configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>() ?? [];

        var allowedOrigins = ResolveAllowedOrigins(builder, configuredOrigins);

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policy =>
            {
                if (allowedOrigins.Length == 0)
                {
                    policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                    return;
                }

                policy.WithOrigins(allowedOrigins)
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });
    }

    /// <summary>
    /// Expo Web (8081/19006) and the API (5113) are different origins — list dev origins explicitly.
    /// JWT is sent via Authorization header; credentials/cookies are not used.
    /// </summary>
    private static string[] ResolveAllowedOrigins(
        WebApplicationBuilder builder,
        string[] configuredOrigins)
    {
        if (configuredOrigins.Length > 0
            && !configuredOrigins.Contains("*", StringComparer.OrdinalIgnoreCase))
        {
            return configuredOrigins;
        }

        if (builder.Environment.IsDevelopment())
        {
            return
            [
                "http://localhost:8081",
                "http://127.0.0.1:8081",
                "http://localhost:19006",
                "http://127.0.0.1:19006",
                "http://localhost:8082",
                "http://127.0.0.1:8082",
            ];
        }

        return configuredOrigins.Where(o => !string.Equals(o, "*", StringComparison.OrdinalIgnoreCase)).ToArray();
    }

    private static void ConfigureDevelopment(WebApplication app)
    {
        if (!app.Environment.IsDevelopment())
        {
            return;
        }

        using var scope = app.Services.CreateScope();
        try
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            dbContext.Database.Migrate();
            DbInitializer.Seed(dbContext);
        }
        catch (Exception ex)
        {
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "Blad podczas migracji bazy danych");
            throw;
        }

        app.MapOpenApi();
    }
}
