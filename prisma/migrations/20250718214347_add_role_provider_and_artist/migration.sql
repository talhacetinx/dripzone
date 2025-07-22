-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userPending" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "role" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Artist" (
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "portfolio" TEXT,
    "experience" INTEGER,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Provider" (
    "userId" TEXT NOT NULL,
    "studioLocation" TEXT NOT NULL,
    "studioPhoto" TEXT NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
