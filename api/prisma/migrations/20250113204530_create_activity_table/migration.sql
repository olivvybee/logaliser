-- CreateTable
CREATE TABLE "Activity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "item" INTEGER NOT NULL,
    "metadata" JSONB
);
