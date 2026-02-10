/*
  Warnings:

  - The primary key for the `cafes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cate_id` on the `cafes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cafes" DROP CONSTRAINT "cafes_pkey",
DROP COLUMN "cate_id",
ADD COLUMN     "cafe_id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "cafes_pkey" PRIMARY KEY ("cafe_id");
