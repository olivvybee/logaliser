-- CreateTable
CREATE TABLE "CrossStitchActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "activityId" INTEGER NOT NULL,
    "crossStitchId" INTEGER NOT NULL,
    "stitches" INTEGER NOT NULL,
    "newStart" BOOLEAN NOT NULL,
    "finish" BOOLEAN NOT NULL,
    CONSTRAINT "CrossStitchActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CrossStitchActivity_crossStitchId_fkey" FOREIGN KEY ("crossStitchId") REFERENCES "CrossStitch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CrossStitch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "stitchCount" INTEGER,
    "completed" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CrossStitchActivity_activityId_key" ON "CrossStitchActivity"("activityId");
