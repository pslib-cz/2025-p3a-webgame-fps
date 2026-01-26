using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FPS_TCG.Server.Migrations
{
    /// <inheritdoc />
    public partial class Skill2Damage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageContentType",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ImageFileName",
                table: "Cards");

            migrationBuilder.AddColumn<int>(
                name: "Skill2Damage",
                table: "Cards",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Skill2Damage",
                table: "Cards");

            migrationBuilder.AddColumn<string>(
                name: "ImageContentType",
                table: "Cards",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "Cards",
                type: "BLOB",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageFileName",
                table: "Cards",
                type: "TEXT",
                nullable: true);
        }
    }
}
