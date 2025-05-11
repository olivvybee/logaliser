-- CreateTable
CREATE TABLE "Activity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL,
    "timezone" TEXT
);

-- CreateTable
CREATE TABLE "CoasterActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "activityId" INTEGER NOT NULL,
    "coasterId" INTEGER NOT NULL,
    "firstRide" BOOLEAN NOT NULL DEFAULT false,
    "inShowExit" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "CoasterActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CoasterActivity_coasterId_fkey" FOREIGN KEY ("coasterId") REFERENCES "Coaster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CoasterActivity_activityId_key" ON "CoasterActivity"("activityId");
