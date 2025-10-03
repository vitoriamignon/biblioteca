-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "pages" INTEGER NOT NULL,
    "rating" REAL NOT NULL,
    "synopsis" TEXT NOT NULL,
    "cover" TEXT,
    "status" TEXT NOT NULL DEFAULT 'QUERO_LER',
    "currentPage" INTEGER NOT NULL DEFAULT 0,
    "isbn" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "genres" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");
