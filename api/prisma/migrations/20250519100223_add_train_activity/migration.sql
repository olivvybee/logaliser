-- CreateTable
CREATE TABLE "TrainActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "activityId" INTEGER NOT NULL,
    "originStationId" INTEGER NOT NULL,
    "destinationStationId" INTEGER NOT NULL,
    CONSTRAINT "TrainActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TrainActivity_originStationId_fkey" FOREIGN KEY ("originStationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TrainActivity_destinationStationId_fkey" FOREIGN KEY ("destinationStationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainActivity_activityId_key" ON "TrainActivity"("activityId");
