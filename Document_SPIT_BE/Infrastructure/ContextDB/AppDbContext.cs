using Domain.Common;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Infrastructure.ContextDB
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSet cho các thực thể
        public DbSet<Document> Documents { get; set; }
        public DbSet<CategoryType> CategoryTypes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<TokenUser> Tokens { get; set; }
        public DbSet<Notification> Notifications { get; set; }  
        public DbSet<History> Histories { get; set; }
        public DbSet<DetailDocument> DetailDocuments { get; set; }
        public DbSet<Role> Roles { get; set; }

        // DbSet cho các mối quan hệ
        public DbSet<StarDocument> StarDocuments { get; set; }
        public DbSet<DocumentCategory> DocumentCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<DocumentCategory>()
                .HasKey(dc => new { dc.DocumentId, dc.CategoryId });

            modelBuilder.Entity<StarDocument>()
                .HasKey(dc => new { dc.DocumentId, dc.UserId });


            modelBuilder.Entity<User>()
               .HasOne(u => u.Role)       // Một User có một Role
               .WithMany(r => r.Users)     // Một Role có nhiều User
               .HasForeignKey(u => u.RoleId)  // User có khóa ngoại trỏ đến Role
               .OnDelete(DeleteBehavior.Restrict); // Khi Role bị xóa, User không bị xóa

            modelBuilder.Entity<TokenUser>()
                .HasOne(u => u.User)
                .WithMany(t => t.Tokens)
                .HasPrincipalKey(u => u.Id)       // liên kết tới User.UserId
                .HasForeignKey(t => t.UserId)         // khóa ngoại ở TokenUser
                .OnDelete(DeleteBehavior.SetNull);

            var roleValues = Enum.GetValues(typeof(Role_Enum)).Cast<Role_Enum>().ToArray();
            var roles = roleValues
                .Select((role, index) => new Role
                {
                    Id = -(index + 1), // Sử dụng ID âm cho dữ liệu seed
                    DisplayName = role.GetEnumDisplayName(),
                    CreatedBy = "System"
                })
                .ToArray();
            modelBuilder.Entity<Role>().HasData(roles);
        }
    }
}