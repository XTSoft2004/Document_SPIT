using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDocument_Course : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Documents_DocumentId",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_Courses_DocumentId",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "DocumentId",
                table: "Courses");

            migrationBuilder.AddColumn<long>(
                name: "CourseId",
                table: "Documents",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Documents_CourseId",
                table: "Documents",
                column: "CourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Courses_CourseId",
                table: "Documents",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Courses_CourseId",
                table: "Documents");

            migrationBuilder.DropIndex(
                name: "IX_Documents_CourseId",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "CourseId",
                table: "Documents");

            migrationBuilder.AddColumn<long>(
                name: "DocumentId",
                table: "Courses",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Courses_DocumentId",
                table: "Courses",
                column: "DocumentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Documents_DocumentId",
                table: "Courses",
                column: "DocumentId",
                principalTable: "Documents",
                principalColumn: "Id");
        }
    }
}
