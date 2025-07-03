/*
  Warnings:

  - Added the required column `departureTime` to the `TrainActivity` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TrainActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "activityId" INTEGER NOT NULL,
    "originStationId" INTEGER NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "destinationStationId" INTEGER,
    "arrivalTime" DATETIME,
    CONSTRAINT "TrainActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TrainActivity_originStationId_fkey" FOREIGN KEY ("originStationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TrainActivity_destinationStationId_fkey" FOREIGN KEY ("destinationStationId") REFERENCES "Station" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TrainActivity" ("activityId", "destinationStationId", "id", "originStationId") SELECT "activityId", "destinationStationId", "id", "originStationId" FROM "TrainActivity";
DROP TABLE "TrainActivity";
ALTER TABLE "new_TrainActivity" RENAME TO "TrainActivity";
CREATE UNIQUE INDEX "TrainActivity_activityId_key" ON "TrainActivity"("activityId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
