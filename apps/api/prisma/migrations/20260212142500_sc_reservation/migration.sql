/*
  Warnings:

  - Added the required column `duration` to the `prices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prices" ADD COLUMN     "duration" DECIMAL(18,2) NOT NULL;
