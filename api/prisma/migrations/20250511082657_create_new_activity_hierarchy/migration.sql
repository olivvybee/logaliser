-- CreateTable
CREATE TABLE "NewActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL,
    "timezone" TEXT
);

-- CreateTable
CREATE TABLE "NewCoasterActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "activityId" INTEGER NOT NULL,
    "coasterId" INTEGER NOT NULL,
    "firstRide" BOOLEAN NOT NULL DEFAULT false,
    "inShowExit" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "NewCoasterActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "NewActivity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NewCoasterActivity_coasterId_fkey" FOREIGN KEY ("coasterId") REFERENCES "Coaster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "NewCoasterActivity_activityId_key" ON "NewCoasterActivity"("activityId");
