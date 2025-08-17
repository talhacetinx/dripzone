-- AlterTable
ALTER TABLE "ProviderProfile" ADD COLUMN     "packages" JSONB[] DEFAULT ARRAY[]::JSONB[];
