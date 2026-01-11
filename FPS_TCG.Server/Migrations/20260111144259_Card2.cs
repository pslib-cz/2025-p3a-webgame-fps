using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FPS_TCG.Server.Migrations
{
    /// <inheritdoc />
    public partial class Card2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isSelected",
                table: "Cards");

            migrationBuilder.AddColumn<int>(
                name: "DeckId",
                table: "Cards",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Decks",
                columns: table => new
                {
                    DeckId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Decks", x => x.DeckId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cards_DeckId",
                table: "Cards",
                column: "DeckId");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Decks_DeckId",
                table: "Cards",
                column: "DeckId",
                principalTable: "Decks",
                principalColumn: "DeckId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Decks_DeckId",
                table: "Cards");

            migrationBuilder.DropTable(
                name: "Decks");

            migrationBuilder.DropIndex(
                name: "IX_Cards_DeckId",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "DeckId",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ImageContentType",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ImageFileName",
                table: "Cards");

            migrationBuilder.AddColumn<bool>(
                name: "isSelected",
                table: "Cards",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }
    }
}
