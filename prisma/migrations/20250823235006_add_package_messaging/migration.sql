-- AlterEnum
ALTER TYPE "MessageType" ADD VALUE 'PACKAGE';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "packageData" TEXT;
