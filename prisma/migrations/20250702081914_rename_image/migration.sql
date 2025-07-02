-- CreateTable
CREATE TABLE "NewsImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "newsId" INTEGER NOT NULL,

    CONSTRAINT "NewsImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NewsImage" ADD CONSTRAINT "NewsImage_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;
