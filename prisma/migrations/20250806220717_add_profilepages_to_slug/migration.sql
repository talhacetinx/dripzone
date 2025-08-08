/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `ArtistProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `ProviderProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `ArtistProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `ProviderProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArtistProfile" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProviderProfile" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ArtistProfile_slug_key" ON "ArtistProfile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfile_slug_key" ON "ProviderProfile"("slug");
