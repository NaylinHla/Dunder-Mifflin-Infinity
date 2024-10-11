using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using dataAccess;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using NSwag;
using NSwag.AspNetCore;
using NSwag.Generation.Processors.Security;
using test;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var envFilePath = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "config.env");
        if (File.Exists(envFilePath))
        {
            var envVariables = File.ReadAllLines(envFilePath);
            foreach (var variable in envVariables)
            {
                if (variable.Contains('='))
                {
                    var parts = variable.Split('=');
                    if (parts.Length == 2)
                    {
                        Environment.SetEnvironmentVariable(parts[0], parts[1]);
                    }
                }
            }
        }

// Construct the PostgresSQL connection string using environment variables
        var user = Environment.GetEnvironmentVariable("POSTGRES_USER");
        var password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
        var database = Environment.GetEnvironmentVariable("POSTGRES_DB");

        var connectionString = $"Host=localhost;Database={database};Username={user};Password={password};";

        builder.Services.AddFluentValidationAutoValidation().AddFluentValidationClientsideAdapters();
        builder.Services.AddControllers();

// Register the DbContext with PostgresSQL using the constructed connection string
        builder.Services.AddDbContext<DMIContext>(options =>
        {
            options.UseNpgsql(Environment.GetEnvironmentVariable("TestDB") ?? connectionString);
            options.EnableSensitiveDataLogging();
        });

        builder.Services.AddDbContext<DMIContext>(opt => opt.UseInMemoryDatabase("DMI"));
        
        builder.Services.AddOpenApiDocument(config =>
        {
            config.DocumentName = "v1";
            config.Title = "Dunder Mifflin Infinity  - Try and test";
            config.Version  = "v1";
    
            // Add JWT Bearer token support
            config.AddSecurity("Bearer", new OpenApiSecurityScheme
            {
                Type = OpenApiSecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "Enter 'Bearer' [space] and then your token."
            });

            // Add security requirements
            config.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("Bearer"));
        });


        builder.Services.AddCors();

        // If TestDB is set, consider it a Testing environment
        if (Environment.GetEnvironmentVariable("TestDB") != null)
        {
            Console.WriteLine("Running in Testing Environment");
            builder.Environment.EnvironmentName = "Testing"; // Set environment to Testing
            builder.Services.AddAuthentication("Test")
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("Test", null);
        }
        else
        {
            // Add JWT authentication when not in Testing environment
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
            {
                var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? "SecretKey";
                var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "http://localhost/";
                var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "http://localhost/";

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };
            });
        }

        var app = builder.Build();
        app.UseStaticFiles();
        app.UseOpenApi();
        app.UseSwaggerUi(c =>
        {
            c.Path = "/swagger";
            c.DocumentPath = "/swagger/v1/swagger.json"; 
            c.CustomJavaScriptPath = "/js/SwaggerAutoLogin.js";
        });


        app.MapControllers();

        app.UseCors(opts =>
        {
            opts.AllowAnyOrigin();

            opts.AllowAnyMethod();

            opts.AllowAnyHeader();
        });

        // Use Authentication and Authorization Middleware
        app.UseAuthentication(); // This must come before UseAuthorization
        app.UseAuthorization();

        // Map controllers
        app.MapControllers();

        app.Run();
    }
}