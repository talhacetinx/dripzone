-- AlterTable
ALTER TABLE "ArtistProfile" ADD COLUMN     "experiences" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "ProviderProfile" ADD COLUMN     "provider_title" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "user_photo" TEXT;
