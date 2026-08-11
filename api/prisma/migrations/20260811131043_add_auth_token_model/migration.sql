-- CreateTable
CREATE TABLE "OauthToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiresAt" DATETIME
);
