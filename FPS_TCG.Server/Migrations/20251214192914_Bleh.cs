using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FPS_TCG.Server.Migrations
{
    /// <inheritdoc />
    public partial class Bleh : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "diceCost2",
                table: "Cards",
                newName: "supportCost");

            migrationBuilder.RenameColumn(
                name: "diceCost1",
                table: "Cards",
                newName: "isSelected");

            migrationBuilder.RenameColumn(
                name: "damage2",
                table: "Cards",
                newName: "Skill2Cost");

            migrationBuilder.RenameColumn(
                name: "damage1",
                table: "Cards",
                newName: "Skill1Damage");

            migrationBuilder.AddColumn<int>(
                name: "Skill1Cost",
                table: "Cards",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Skill1Name",
                table: "Cards",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Skill2Name",
                table: "Cards",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "skill2Effect",
                table: "Cards",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "supportEffect",
                table: "Cards",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Skill1Cost",
                table: "Cards");

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

            migrationBuilder.RenameColumn(
                name: "supportCost",
                table: "Cards",
                newName: "diceCost2");

            migrationBuilder.RenameColumn(
                name: "isSelected",
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
