/*
  Warnings:

  - You are about to drop the `Space` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OccupancyStatus" AS ENUM ('EMPTY', 'OCCUPIED');

-- DropForeignKey
ALTER TABLE "Assets" DROP CONSTRAINT "Assets_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Facility" DROP CONSTRAINT "Facility_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_buildingId_fkey";

-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_updatedBy_fkey";

-- DropTable
DROP TABLE "Space";

-- CreateTable
CREATE TABLE "occupancy_logs" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "personCount" INTEGER NOT NULL,
    "occupancyStatus" "OccupancyStatus" NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "occupancy_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spaces" (
    "id" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "floor" INTEGER,
    "capacity" INTEGER NOT NULL,
    "code" TEXT,
    "picture" TEXT NOT NULL,
    "pictureId" TEXT NOT NULL,
    "status" "SpaceStatus" NOT NULL DEFAULT 'AVAILABLE',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "personCount" INTEGER NOT NULL DEFAULT 0,
    "occupancyStatus" "OccupancyStatus" NOT NULL DEFAULT 'EMPTY',
    "lastDetectedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spaces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "occupancy_logs_spaceId_idx" ON "occupancy_logs"("spaceId");

-- CreateIndex
CREATE INDEX "occupancy_logs_detectedAt_idx" ON "occupancy_logs"("detectedAt");

-- CreateIndex
CREATE UNIQUE INDEX "spaces_code_key" ON "spaces"("code");

-- AddForeignKey
ALTER TABLE "occupancy_logs" ADD CONSTRAINT "occupancy_logs_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assets" ADD CONSTRAINT "Assets_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facility" ADD CONSTRAINT "Facility_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
