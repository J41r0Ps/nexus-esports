using Microsoft.EntityFrameworkCore;
using Nexus.Infrastructure.DbContexts;
using Nexus.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Controllers + JSON cycle fix
builder.Services.AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.ReferenceHandler =
        System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);

builder.Services.AddOpenApi();

// Swagger
builder.Services.AddSwaggerGen();

// AutoMapper
builder.Services.AddAutoMapper(cfg => cfg.LicenseKey = builder.Configuration["AutoMapperKey"],
    AppDomain.CurrentDomain.GetAssemblies());

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
//builder.Services.AddScoped<IMatchRepository, MatchRepository>();


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
app.UseAuthorization();
app.MapControllers();

app.Run();