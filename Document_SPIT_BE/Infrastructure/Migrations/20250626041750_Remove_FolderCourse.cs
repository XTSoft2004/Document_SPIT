using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Remove_FolderCourse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FolderId_Base",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "FolderId_Contribute",
                table: "Courses");

            migrationBuilder.RenameColumn(
                name: "FolderId_Recycle",
                table: "Courses",
                newName: "FolderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FolderId",
                table: "Courses",
                newName: "FolderId_Recycle");

            migrationBuilder.AddColumn<string>(
                name: "FolderId_Base",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FolderId_Contribute",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
