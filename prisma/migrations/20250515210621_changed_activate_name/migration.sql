/*
  Warnings:

  - You are about to drop the column `activate_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `activate_token_expiry` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[activateCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_activate_token_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "activate_token",
DROP COLUMN "activate_token_expiry",
ADD COLUMN     "activateCode" TEXT,
ADD COLUMN     "activateCodeExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_activateCode_key" ON "User"("activateCode");
