/*
  Warnings:

  - You are about to drop the `NewActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NewCoasterActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NewActivity";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NewCoasterActivity";
PRAGMA foreign_keys=on;
