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
            migrationBuilder.CreateTable(
                name: "Cards",
                columns: table => new
                {
                    CardId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    type = table.Column<string>(type: "TEXT", nullable: false),
                    damage1 = table.Column<int>(type: "INTEGER", nullable: false),
                    damage2 = table.Column<int>(type: "INTEGER", nullable: false),
                    health = table.Column<int>(type: "INTEGER", nullable: false),
                    shield = table.Column<int>(type: "INTEGER", nullable: false),
                    diceCost1 = table.Column<int>(type: "INTEGER", nullable: false),
                    diceCost2 = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cards", x => x.CardId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cards");
        }
    }
}
