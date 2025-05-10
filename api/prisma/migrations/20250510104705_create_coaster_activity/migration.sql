-- CreateTable
CREATE TABLE "CoasterActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "timezoneOffset" INTEGER,
    "firstRide" BOOLEAN NOT NULL DEFAULT false,
    "inShowExit" BOOLEAN NOT NULL DEFAULT false,
    "coasterId" INTEGER NOT NULL,
    CONSTRAINT "CoasterActivity_coasterId_fkey" FOREIGN KEY ("coasterId") REFERENCES "Coaster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
