/*
  Warnings:

  - You are about to drop the column `completed` on the `CrossStitch` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CrossStitch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "pattern" TEXT,
    "stitchCount" INTEGER,
    "startDate" DATETIME,
    "endDate" DATETIME
);
INSERT INTO "new_CrossStitch" ("id", "name", "pattern", "stitchCount") SELECT "id", "name", "pattern", "stitchCount" FROM "CrossStitch";
DROP TABLE "CrossStitch";
ALTER TABLE "new_CrossStitch" RENAME TO "CrossStitch";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
