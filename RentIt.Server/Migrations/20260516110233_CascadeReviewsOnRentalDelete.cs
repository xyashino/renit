using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentIt.Server.Migrations
{
    /// <inheritdoc />
    public partial class CascadeReviewsOnRentalDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Rentals_RentalId",
                table: "Reviews");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Rentals_RentalId",
                table: "Reviews",
                column: "RentalId",
                principalTable: "Rentals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Rentals_RentalId",
                table: "Reviews");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Rentals_RentalId",
                table: "Reviews",
                column: "RentalId",
                principalTable: "Rentals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
