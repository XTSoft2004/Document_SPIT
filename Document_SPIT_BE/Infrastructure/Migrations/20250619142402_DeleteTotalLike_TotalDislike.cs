using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DeleteTotalLike_TotalDislike : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalDislike",
                table: "DetailDocuments");

            migrationBuilder.DropColumn(
                name: "TotalLike",
                table: "DetailDocuments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "TotalDislike",
                table: "DetailDocuments",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "TotalLike",
                table: "DetailDocuments",
                type: "bigint",
                nullable: true);
        }
    }
}
