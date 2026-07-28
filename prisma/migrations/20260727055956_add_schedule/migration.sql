-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('EVENT', 'MAINTENANCE', 'HOLIDAY', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('ACTIVE', 'CANCELLED');

-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "type" "ScheduleType" NOT NULL DEFAULT 'EVENT',
    "status" "ScheduleStatus" NOT NULL DEFAULT 'ACTIVE',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "schedules_space_id_idx" ON "schedules"("space_id");

-- CreateIndex
CREATE INDEX "schedules_start_time_end_time_idx" ON "schedules"("start_time", "end_time");

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
