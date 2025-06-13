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
        public DbSet<DocumentType> DocumentTypes { get; set; }
        public DbSet<CategoryType> CategoryTypes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<TokenUser> Tokens { get; set; }
        public DbSet<Notification> Notifications { get; set; }  

        // DbSet cho các mối quan hệ
        public DbSet<DocumentCategory> DocumentCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<DocumentCategory>()
                .HasKey(dc => new { dc.DocumentId, dc.CategoryId });

            modelBuilder.Entity<TokenUser>()
                .HasOne(u => u.User)
                .WithMany(t => t.Tokens)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}