-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coaster" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "opened" TEXT,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "latitude" REAL,
    "longitude" REAL,
    "make" TEXT,
    "model" TEXT,
    "type" TEXT,
    "design" TEXT,
    "length" REAL,
    "height" REAL,
    "drop" REAL,
    "speed" REAL,
    "verticalAngle" REAL,
    "inversions" INTEGER,
    "duration" INTEGER,
    "parkId" INTEGER NOT NULL,
    "ridden" BOOLEAN NOT NULL DEFAULT false,
    "riddenDate" DATETIME,
    CONSTRAINT "Coaster_parkId_fkey" FOREIGN KEY ("parkId") REFERENCES "ThemePark" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Coaster" ("design", "drop", "duration", "height", "id", "inversions", "latitude", "length", "longitude", "make", "model", "name", "opened", "parkId", "ridden", "riddenDate", "speed", "type", "verticalAngle") SELECT "design", "drop", "duration", "height", "id", "inversions", "latitude", "length", "longitude", "make", "model", "name", "opened", "parkId", "ridden", "riddenDate", "speed", "type", "verticalAngle" FROM "Coaster";
DROP TABLE "Coaster";
ALTER TABLE "new_Coaster" RENAME TO "Coaster";
CREATE UNIQUE INDEX "Coaster_id_key" ON "Coaster"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
