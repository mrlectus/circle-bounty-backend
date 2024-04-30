-- AlterTable
ALTER TABLE "User" ADD COLUMN     "contactId" INTEGER;

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "name" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
