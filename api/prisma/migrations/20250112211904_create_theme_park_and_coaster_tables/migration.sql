-- CreateTable
CREATE TABLE "ThemePark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL
);

-- CreateTable
CREATE TABLE "Coaster" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "opened" TEXT,
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
    CONSTRAINT "Coaster_parkId_fkey" FOREIGN KEY ("parkId") REFERENCES "ThemePark" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ThemePark_id_key" ON "ThemePark"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Coaster_id_key" ON "Coaster"("id");
