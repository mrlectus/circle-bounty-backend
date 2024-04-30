/*
  Warnings:

  - A unique constraint covering the columns `[walletAddress]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contact_walletAddress_key" ON "Contact"("walletAddress");
