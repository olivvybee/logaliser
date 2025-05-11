/*
  Warnings:

  - A unique constraint covering the columns `[nationalId]` on the table `Station` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Station_nationalId_key" ON "Station"("nationalId");
