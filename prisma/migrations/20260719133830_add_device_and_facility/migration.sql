/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `macAddress` on the `devices` table. All the data in the column will be lost.
  - Made the column `serialNumber` on table `devices` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "devices_macAddress_key";

-- AlterTable
ALTER TABLE "devices" DROP COLUMN "ipAddress",
DROP COLUMN "macAddress",
ALTER COLUMN "serialNumber" SET NOT NULL;
