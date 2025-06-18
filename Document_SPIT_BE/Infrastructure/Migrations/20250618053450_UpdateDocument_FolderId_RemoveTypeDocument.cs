using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDocument_FolderId_RemoveTypeDocument : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Documents_DocumentTypes_idTypeDocument",
                table: "Documents");

            migrationBuilder.RenameColumn(
                name: "idTypeDocument",
                table: "Documents",
                newName: "DocumentTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_Documents_idTypeDocument",
                table: "Documents",
                newName: "IX_Documents_DocumentTypeId");

            migrationBuilder.AddColumn<string>(
                name: "FolderId",
                table: "Documents",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_DocumentTypes_DocumentTypeId",
                table: "Documents",
                column: "DocumentTypeId",
                principalTable: "DocumentTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Documents_DocumentTypes_DocumentTypeId",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "FolderId",
                table: "Documents");

            migrationBuilder.RenameColumn(
                name: "DocumentTypeId",
                table: "Documents",
                newName: "idTypeDocument");

            migrationBuilder.RenameIndex(
                name: "IX_Documents_DocumentTypeId",
                table: "Documents",
                newName: "IX_Documents_idTypeDocument");

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_DocumentTypes_idTypeDocument",
                table: "Documents",
                column: "idTypeDocument",
                principalTable: "DocumentTypes",
                principalColumn: "Id");
        }
    }
}
