-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startDate" DATETIME,
    "endDate" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "item" INTEGER NOT NULL,
    "metadata" JSONB
);
INSERT INTO "new_Activity" ("endDate", "id", "item", "metadata", "startDate", "type") SELECT "endDate", "id", "item", "metadata", "startDate", "type" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
