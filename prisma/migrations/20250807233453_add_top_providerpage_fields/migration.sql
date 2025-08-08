/*
  Warnings:

  - You are about to drop the column `contactEmail` on the `ProviderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `studioMap` on the `ProviderProfile` table. All the data in the column will be lost.
  - The `services` column on the `ProviderProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ProviderProfile" DROP COLUMN "contactEmail",
DROP COLUMN "studioMap",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "genres" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "importantClients" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "projectCount" INTEGER,
ADD COLUMN     "responseTime" INTEGER,
ADD COLUMN     "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "studioPhotos" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "services",
ADD COLUMN     "services" TEXT[] DEFAULT ARRAY[]::TEXT[];
