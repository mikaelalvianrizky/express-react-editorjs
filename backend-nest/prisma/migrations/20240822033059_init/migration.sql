-- CreateTable
CREATE TABLE "Code" (
    "id" SERIAL NOT NULL,
    "html" TEXT,
    "css" TEXT,
    "js" TEXT,
    "content" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Code_pkey" PRIMARY KEY ("id")
);
