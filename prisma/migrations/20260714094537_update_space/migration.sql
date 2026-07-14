/*
  Warnings:

  - The `status` column on the `Space` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[code]` on the table `Space` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SpaceStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'POTENTIAL_AVAILABLE', 'NON_SCHEDULED_USE');

-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "code" TEXT,
ALTER COLUMN "floor" DROP NOT NULL,
ALTER COLUMN "pictureId" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "SpaceStatus" NOT NULL DEFAULT 'AVAILABLE';

-- CreateIndex
CREATE UNIQUE INDEX "Space_code_key" ON "Space"("code");
