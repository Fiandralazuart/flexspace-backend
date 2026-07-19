/*
  Warnings:

  - Added the required column `channel` to the `facilities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "facilities" ADD COLUMN     "channel" INTEGER NOT NULL;
