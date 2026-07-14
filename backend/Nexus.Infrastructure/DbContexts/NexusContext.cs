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

            // Team -> Country Restrict (if the country is deleted, the team is not deleted)
            modelBuilder.Entity<Team>()
                .HasOne(t => t.Country)
                    .WithMany(c => c.Teams)
                .HasForeignKey(t => t.CountryId)
                    .OnDelete(DeleteBehavior.Restrict);
            // Player -> Team Set Null, free agents (if the team is deleted, the player becomes a free agent)
            modelBuilder.Entity<Player>()
                .HasOne(p => p.Team)
                    .WithMany(t => t.Players)
                .HasForeignKey(p => p.TeamId)
                    .OnDelete(DeleteBehavior.SetNull);
            // Player -> Country Restrict (if the country is deleted, the player is not deleted)
            modelBuilder.Entity<Player>()
                .HasOne(p => p.Country)
                    .WithMany(c => c.Players)
                .HasForeignKey(p => p.CountryId)
                    .OnDelete(DeleteBehavior.Restrict);
            // Match -> Team1, Team2 Restrict (if either team is deleted, the match is not deleted)
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
            // TournamentRegistration → Team Cascade (if the team is deleted, the registration is deleted)
            modelBuilder.Entity<TournamentRegistration>()
                .HasOne(tr => tr.Team)
                    .WithMany(t => t.TournamentRegistrations)
                .HasForeignKey(tr => tr.TeamId)
                    .OnDelete(DeleteBehavior.Cascade);
            // TournamentRegistration → Tournament Cascade (if the tournament is deleted, the registration is deleted)
            modelBuilder.Entity<TournamentRegistration>()
                .HasOne(tr => tr.Tournament)
                    .WithMany(t => t.TournamentRegistrations)
                .HasForeignKey(tr => tr.TournamentId)
                    .OnDelete(DeleteBehavior.Cascade);
            // Achievement → Player Cascade (if the player is deleted, the achievement is deleted)
            modelBuilder.Entity<Achievement>()
                .HasOne(a => a.Player)
                    .WithMany(p => p.Achievements)
                .HasForeignKey(a => a.PlayerId)
                    .OnDelete(DeleteBehavior.Cascade);
            // Achievement → Tournament Restrict (if the tournament is deleted, the achievement is not deleted)
            modelBuilder.Entity<Achievement>()
                .HasOne(a => a.Tournament)
                    .WithMany()
                .HasForeignKey(a => a.TournamentId)
                    .OnDelete(DeleteBehavior.Restrict);
            // PlayerStat → Player Cascade (if the player is deleted, the stat is deleted)
            modelBuilder.Entity<PlayerStat>()
                .HasOne(ps => ps.Player)
                    .WithMany(p => p.PlayerStats)
                .HasForeignKey(ps => ps.PlayerId)
                    .OnDelete(DeleteBehavior.Cascade);
            // PlayerStat → Match Restrict (if the match is deleted, the stat is not deleted)
            modelBuilder.Entity<PlayerStat>()
                .HasOne(ps => ps.Match)
                    .WithMany(m => m.PlayerStats)
                .HasForeignKey(ps => ps.MatchId)
                    .OnDelete(DeleteBehavior.Restrict);

            // Decimal precision for monetary values
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
