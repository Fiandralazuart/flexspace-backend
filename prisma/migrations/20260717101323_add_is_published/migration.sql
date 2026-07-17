-- AlterTable
ALTER TABLE "Building" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;
