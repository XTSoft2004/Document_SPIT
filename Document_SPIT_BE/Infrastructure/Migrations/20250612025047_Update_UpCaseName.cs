using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Update_UpCaseName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Users_idUser",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Users_userId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Tokens_Users_userId",
                table: "Tokens");

            migrationBuilder.RenameColumn(
                name: "userId",
                table: "Tokens",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "token",
                table: "Tokens",
                newName: "Token");

            migrationBuilder.RenameColumn(
                name: "expiryDate",
                table: "Tokens",
                newName: "ExpiryDate");

            migrationBuilder.RenameIndex(
                name: "IX_Tokens_userId",
                table: "Tokens",
                newName: "IX_Tokens_UserId");

            migrationBuilder.RenameColumn(
                name: "userId",
                table: "Notifications",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "message",
                table: "Notifications",
                newName: "Message");

            migrationBuilder.RenameColumn(
                name: "isRead",
                table: "Notifications",
                newName: "IsRead");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Notifications",
                newName: "Description");

            migrationBuilder.RenameIndex(
                name: "IX_Notifications_userId",
                table: "Notifications",
                newName: "IX_Notifications_UserId");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "DocumentTypes",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "DocumentTypes",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "totalViews",
                table: "Documents",
                newName: "TotalViews");

            migrationBuilder.RenameColumn(
                name: "totalDownloads",
                table: "Documents",
                newName: "TotalDownloads");

            migrationBuilder.RenameColumn(
                name: "statusDocument",
                table: "Documents",
                newName: "StatusDocument");

            migrationBuilder.RenameColumn(
                name: "pathFile",
                table: "Documents",
                newName: "PathFile");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Documents",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "isPrivate",
                table: "Documents",
                newName: "IsPrivate");

            migrationBuilder.RenameColumn(
                name: "idUser",
                table: "Documents",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Documents_idUser",
                table: "Documents",
                newName: "IX_Documents_UserId");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "CategoryTypes",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "CategoryTypes",
                newName: "Description");

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Users_UserId",
                table: "Documents",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Users_UserId",
                table: "Notifications",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tokens_Users_UserId",
                table: "Tokens",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Users_UserId",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Users_UserId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Tokens_Users_UserId",
                table: "Tokens");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Tokens",
                newName: "userId");

            migrationBuilder.RenameColumn(
                name: "Token",
                table: "Tokens",
                newName: "token");

            migrationBuilder.RenameColumn(
                name: "ExpiryDate",
                table: "Tokens",
                newName: "expiryDate");

            migrationBuilder.RenameIndex(
                name: "IX_Tokens_UserId",
                table: "Tokens",
                newName: "IX_Tokens_userId");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Notifications",
                newName: "userId");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "Notifications",
                newName: "message");

            migrationBuilder.RenameColumn(
                name: "IsRead",
                table: "Notifications",
                newName: "isRead");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Notifications",
                newName: "description");

            migrationBuilder.RenameIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                newName: "IX_Notifications_userId");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "DocumentTypes",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "DocumentTypes",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "TotalViews",
                table: "Documents",
                newName: "totalViews");

            migrationBuilder.RenameColumn(
                name: "TotalDownloads",
                table: "Documents",
                newName: "totalDownloads");

            migrationBuilder.RenameColumn(
                name: "StatusDocument",
                table: "Documents",
                newName: "statusDocument");

            migrationBuilder.RenameColumn(
                name: "PathFile",
                table: "Documents",
                newName: "pathFile");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Documents",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "IsPrivate",
                table: "Documents",
                newName: "isPrivate");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Documents",
                newName: "idUser");

            migrationBuilder.RenameIndex(
                name: "IX_Documents_UserId",
                table: "Documents",
                newName: "IX_Documents_idUser");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "CategoryTypes",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "CategoryTypes",
                newName: "description");

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Users_idUser",
                table: "Documents",
                column: "idUser",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Users_userId",
                table: "Notifications",
                column: "userId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tokens_Users_userId",
                table: "Tokens",
                column: "userId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
