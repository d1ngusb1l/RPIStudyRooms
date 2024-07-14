/*
  Warnings:

  - Changed the type of `timeOfReport` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "timeOfReport",
ADD COLUMN     "timeOfReport" TIMESTAMP(3) NOT NULL;
