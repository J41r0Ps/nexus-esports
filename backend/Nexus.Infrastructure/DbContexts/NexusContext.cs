using Microsoft.EntityFrameworkCore;
using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.DbContexts
{
    public class NexusContext(DbContextOptions<NexusContext> options) : DbContext(options)
    {
        public DbSet<Country> Countries { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<TeamSponsor> TeamSponsors { get; set; }
        public DbSet<Sponsor> Sponsors { get; set; }
        public DbSet<Tournament> Tournaments { get; set; }
        public DbSet<Stage> Stages { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<PlayerStat> PlayerStats { get; set; }
        public DbSet<Achievement> Achievements { get; set; }
        public DbSet<TournamentRegistration> TournamentRegistrations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(NexusContext).Assembly);
            base.OnModelCreating(modelBuilder);

            // Many-to-many: Team ↔ Sponsor 
            modelBuilder.Entity<Team>()
                .HasMany(t => t.Sponsors)
                    .WithMany(s => s.Teams)
                .UsingEntity<TeamSponsor>();

            // Enum → string
            modelBuilder.Entity<Game>()
                .Property(g => g.Genre).HasConversion<string>();
            modelBuilder.Entity<Player>()
                .Property(p => p.Role).HasConversion<string>();
            modelBuilder.Entity<Team>()
                .Property(t => t.Region).HasConversion<string>();
            modelBuilder.Entity<Sponsor>()
                .Property(s => s.Industry).HasConversion<string>();
            modelBuilder.Entity<Tournament>()
                .Property(t => t.Status).HasConversion<string>();
            modelBuilder.Entity<Tournament>()
                .Property(t => t.Format).HasConversion<string>();
            modelBuilder.Entity<Stage>()
                .Property(s => s.StageType).HasConversion<string>();

            // Cascade fixes: Team 
            modelBuilder.Entity<Team>()
                .HasOne(t => t.Country)
                .WithMany(c => c.Teams)
                .HasForeignKey(t => t.CountryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cascade fixes: Player 
            modelBuilder.Entity<Player>()
                .HasOne(p => p.Team)
                .WithMany(t => t.Players)
                .HasForeignKey(p => p.TeamId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Player>()
                .HasOne(p => p.Country)
                .WithMany(c => c.Players)
                .HasForeignKey(p => p.CountryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cascade fixes: Match
            modelBuilder.Entity<Match>()
                .HasOne(m => m.Team1)
                .WithMany()
                .HasForeignKey(m => m.Team1Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Match>()
                .HasOne(m => m.Team2)
                .WithMany()
                .HasForeignKey(m => m.Team2Id)
                .OnDelete(DeleteBehavior.Restrict);

            // Cascade fixes: TournamentRegistration
            modelBuilder.Entity<TournamentRegistration>()
                .HasOne(tr => tr.Team)
                .WithMany(t => t.TournamentRegistrations)
                .HasForeignKey(tr => tr.TeamId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TournamentRegistration>()
                .HasOne(tr => tr.Tournament)
                .WithMany(t => t.TournamentRegistrations)
                .HasForeignKey(tr => tr.TournamentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cascade fixes: Achievement
            modelBuilder.Entity<Achievement>()
                .HasOne(a => a.Player)
                .WithMany(p => p.Achievements)
                .HasForeignKey(a => a.PlayerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Achievement>()
                .HasOne(a => a.Tournament)
                .WithMany()
                .HasForeignKey(a => a.TournamentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cascade fixes: PlayerStat
            modelBuilder.Entity<PlayerStat>()
                .HasOne(ps => ps.Player)
                .WithMany(p => p.PlayerStats)
                .HasForeignKey(ps => ps.PlayerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PlayerStat>()
                .HasOne(ps => ps.Match)
                .WithMany(m => m.PlayerStats)
                .HasForeignKey(ps => ps.MatchId)
                .OnDelete(DeleteBehavior.Restrict);

            // Decimal precision fixes
            modelBuilder.Entity<Player>()
                .Property(p => p.Salary)
                .HasPrecision(18, 2);

            modelBuilder.Entity<PlayerStat>()
                .Property(ps => ps.Score)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Sponsor>()
                .Property(s => s.ContractValue)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Tournament>()
                .Property(t => t.PrizePool)
                .HasPrecision(18, 2);
        }
    }
}
