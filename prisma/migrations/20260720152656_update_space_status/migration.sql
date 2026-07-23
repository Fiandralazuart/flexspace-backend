/*
  Warnings:

  - The values [AVAILABLE,IN_USE,POTENTIAL_AVAILABLE,NON_SCHEDULED_USE] on the enum `SpaceStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SpaceStatus_new" AS ENUM ('ACTIVE', 'MAINTENANCE', 'INACTIVE');
ALTER TABLE "public"."spaces" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "spaces" ALTER COLUMN "status" TYPE "SpaceStatus_new" USING ("status"::text::"SpaceStatus_new");
ALTER TYPE "SpaceStatus" RENAME TO "SpaceStatus_old";
ALTER TYPE "SpaceStatus_new" RENAME TO "SpaceStatus";
DROP TYPE "public"."SpaceStatus_old";
ALTER TABLE "spaces" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "spaces" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
