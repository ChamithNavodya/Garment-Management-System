/*
  Warnings:

  - Added the required column `submissionId` to the `completed_tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "completed_tasks" ADD COLUMN     "submissionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "task_submissions" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "submissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "task_submissions_employeeId_idx" ON "task_submissions"("employeeId");

-- CreateIndex
CREATE INDEX "task_submissions_submissionDate_idx" ON "task_submissions"("submissionDate");

-- CreateIndex
CREATE INDEX "completed_tasks_submissionId_idx" ON "completed_tasks"("submissionId");

-- AddForeignKey
ALTER TABLE "completed_tasks" ADD CONSTRAINT "completed_tasks_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "task_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_submissions" ADD CONSTRAINT "task_submissions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
