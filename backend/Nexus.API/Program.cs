using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Nexus.Infrastructure.DbContexts;
using Nexus.Infrastructure.Services;
using Nexus.Infrastructure.Strategies;

var builder = WebApplication.CreateBuilder(args);

// Controllers + JSON cycle fix
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;

        // Json to send " " instead of needing the numeric value for enums 
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    } );

builder.Services.AddOpenApi();

// Swagger
builder.Services.AddSwaggerGen();

// AutoMapper
builder.Services.AddAutoMapper(cfg => cfg.LicenseKey = builder.Configuration["AutoMapperKey"],
    AppDomain.CurrentDomain.GetAssemblies());

// Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Auth0:Authority"];
        options.Audience = builder.Configuration["Auth0:Audience"];
    });

// Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireClaim("https://nexus-esports.com/roles", "admin"));
});

// DbContext
builder.Services.AddDbContext<NexusContext>(options =>
    options.UseSqlServer(
        builder.Configuration["ConnectionStrings:NexusDBConnectionString"]
            .Replace(@"\\", @"\"), sql =>
            {
                sql.MigrationsAssembly(typeof(NexusContext).Assembly.FullName);
            }));

// Register repositories
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<IPlayerRepository, PlayerRepository>();
builder.Services.AddScoped<ITournamentRepository, TournamentRepository>();
builder.Services.AddScoped<IGameRepository, GameRepository>();
builder.Services.AddScoped<ICountryRepository, CountryRepository>();
builder.Services.AddScoped<IStageRepository, StageRepository>();
builder.Services.AddScoped<IMatchRepository, MatchRepository>();

// Mail service
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddScoped<IEmailService, ConsoleEmailService>();
}
else
{
    builder.Services.AddScoped<IEmailService, MailtrapEmailService>();
}

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
              .WithHeaders("Content-Type", "Authorization")
              .AllowAnyMethod()
              .WithExposedHeaders("X-Pagination")
    );
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();