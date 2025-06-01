/*
  Warnings:

  - You are about to drop the column `is_expired` on the `invite_codes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invite_codes" DROP COLUMN "is_expired",
ADD COLUMN     "isExpired" BOOLEAN NOT NULL DEFAULT false;
