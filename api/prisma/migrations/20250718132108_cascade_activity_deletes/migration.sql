-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CoasterActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "activityId" INTEGER NOT NULL,
    "coasterId" INTEGER NOT NULL,
    "firstRide" BOOLEAN NOT NULL DEFAULT false,
    "inShowExit" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CoasterActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CoasterActivity_coasterId_fkey" FOREIGN KEY ("coasterId") REFERENCES "Coaster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CoasterActivity" ("activityId", "coasterId", "firstRide", "id", "inShowExit") SELECT "activityId", "coasterId", "firstRide", "id", "inShowExit" FROM "CoasterActivity";
DROP TABLE "CoasterActivity";
ALTER TABLE "new_CoasterActivity" RENAME TO "CoasterActivity";
CREATE UNIQUE INDEX "CoasterActivity_activityId_key" ON "CoasterActivity"("activityId");
CREATE TABLE "new_TrainActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "activityId" INTEGER NOT NULL,
    "originStationId" INTEGER NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "departureTimezone" TEXT,
    "destinationStationId" INTEGER,
    "arrivalTime" DATETIME,
    "arrivalTimezone" TEXT,
    CONSTRAINT "TrainActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TrainActivity_originStationId_fkey" FOREIGN KEY ("originStationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TrainActivity_destinationStationId_fkey" FOREIGN KEY ("destinationStationId") REFERENCES "Station" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TrainActivity" ("activityId", "arrivalTime", "arrivalTimezone", "departureTime", "departureTimezone", "destinationStationId", "id", "originStationId") SELECT "activityId", "arrivalTime", "arrivalTimezone", "departureTime", "departureTimezone", "destinationStationId", "id", "originStationId" FROM "TrainActivity";
DROP TABLE "TrainActivity";
ALTER TABLE "new_TrainActivity" RENAME TO "TrainActivity";
CREATE UNIQUE INDEX "TrainActivity_activityId_key" ON "TrainActivity"("activityId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
