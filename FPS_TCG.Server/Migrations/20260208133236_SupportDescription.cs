using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FPS_TCG.Server.Migrations
{
    /// <inheritdoc />
    public partial class SupportDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DeckCards_Cards_CardId",
                table: "DeckCards");

            migrationBuilder.DropForeignKey(
                name: "FK_DeckCards_Decks_DeckId",
                table: "DeckCards");

            migrationBuilder.RenameColumn(
                name: "type",
                table: "Cards",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "supportEffect",
                table: "Cards",
                newName: "SupportEffect");

            migrationBuilder.RenameColumn(
                name: "supportCost",
                table: "Cards",
                newName: "SupportCost");

            migrationBuilder.RenameColumn(
                name: "skill2Effect",
                table: "Cards",
                newName: "Skill2Effect");

            migrationBuilder.RenameColumn(
                name: "shield",
                table: "Cards",
                newName: "Shield");

            migrationBuilder.RenameColumn(
                name: "health",
                table: "Cards",
                newName: "Health");

            migrationBuilder.AddColumn<string>(
                name: "SupportDescription",
                table: "Cards",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_DeckCards_Cards_CardId",
                table: "DeckCards",
                column: "CardId",
                principalTable: "Cards",
                principalColumn: "CardId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DeckCards_Decks_DeckId",
                table: "DeckCards",
                column: "DeckId",
                principalTable: "Decks",
                principalColumn: "DeckId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DeckCards_Cards_CardId",
                table: "DeckCards");

            migrationBuilder.DropForeignKey(
                name: "FK_DeckCards_Decks_DeckId",
                table: "DeckCards");

            migrationBuilder.DropColumn(
                name: "SupportDescription",
                table: "Cards");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Cards",
                newName: "type");

            migrationBuilder.RenameColumn(
                name: "SupportEffect",
                table: "Cards",
                newName: "supportEffect");

            migrationBuilder.RenameColumn(
                name: "SupportCost",
                table: "Cards",
                newName: "supportCost");

            migrationBuilder.RenameColumn(
                name: "Skill2Effect",
                table: "Cards",
                newName: "skill2Effect");

            migrationBuilder.RenameColumn(
                name: "Shield",
                table: "Cards",
                newName: "shield");

            migrationBuilder.RenameColumn(
                name: "Health",
                table: "Cards",
                newName: "health");

            migrationBuilder.AddForeignKey(
                name: "FK_DeckCards_Cards_CardId",
                table: "DeckCards",
                column: "CardId",
                principalTable: "Cards",
                principalColumn: "CardId");

            migrationBuilder.AddForeignKey(
                name: "FK_DeckCards_Decks_DeckId",
                table: "DeckCards",
                column: "DeckId",
                principalTable: "Decks",
                principalColumn: "DeckId");
        }
    }
}
