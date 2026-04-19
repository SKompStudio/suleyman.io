-- CreateTable
CREATE TABLE "ResumeDocument" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "title" TEXT NOT NULL DEFAULT 'Resume',
    "subtitle" TEXT,
    "summary" TEXT,
    "pdfUrl" TEXT,
    "pdfFilename" TEXT,
    "pdfUploadedAt" TIMESTAMP(3),
    "location" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumeDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeExperience" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "companyUrl" TEXT,
    "location" TEXT,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "bullets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tech" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumeExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeEducation" (
    "id" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "location" TEXT,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "details" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumeEducation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeSkill" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumeSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeCertification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issuedAt" TEXT,
    "credentialUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumeCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "ResumeExperience_visible_order_idx" ON "ResumeExperience"("visible", "order");

-- CreateIndex
CREATE INDEX "ResumeEducation_visible_order_idx" ON "ResumeEducation"("visible", "order");

-- CreateIndex
CREATE INDEX "ResumeSkill_visible_category_order_idx" ON "ResumeSkill"("visible", "category", "order");

-- CreateIndex
CREATE INDEX "ResumeCertification_visible_order_idx" ON "ResumeCertification"("visible", "order");
