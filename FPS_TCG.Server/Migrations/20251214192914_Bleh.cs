using Microsoft.EntityFrameworkCore.Migrations;

namespace FPS_TCG.Server.Migrations
{
    /// <inheritdoc />
    public partial class Bleh : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "Cards",
                type: "BLOB",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageContentType",
                table: "Cards",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageFileName",
                table: "Cards",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Skill1Name",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Skill2Name",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "skill2Effect",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "supportEffect",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ImageContentType",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ImageFileName",
                table: "Cards");

            migrationBuilder.RenameColumn(
                name: "supportCost",
                table: "Cards",
                newName: "diceCost2");

            migrationBuilder.RenameColumn(
                name: "Skill1Cost",
                table: "Cards",
                newName: "diceCost1");

            migrationBuilder.RenameColumn(
                name: "Skill2Cost",
                table: "Cards",
                newName: "damage2");

            migrationBuilder.RenameColumn(
                name: "Skill1Damage",
                table: "Cards",
                newName: "damage1");
        }
    }
}