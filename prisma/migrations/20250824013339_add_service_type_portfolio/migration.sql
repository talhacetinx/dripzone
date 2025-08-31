/*
  Warnings:

  - You are about to drop the column `studioPhoto` on the `ProviderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `studioPhotos` on the `ProviderProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProviderProfile" DROP COLUMN "studioPhoto",
DROP COLUMN "studioPhotos",
ADD COLUMN     "portfolioFiles" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "serviceType" TEXT;
