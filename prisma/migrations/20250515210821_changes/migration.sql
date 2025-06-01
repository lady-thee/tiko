/*
  Warnings:

  - You are about to drop the column `activateCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `activateCodeExpiry` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[activationCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_activateCode_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "activateCode",
DROP COLUMN "activateCodeExpiry",
ADD COLUMN     "activationCode" TEXT,
ADD COLUMN     "activationCodeExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_activationCode_key" ON "User"("activationCode");
