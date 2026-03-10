/*
  Warnings:

  - You are about to drop the column `age` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nic]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nic]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nic` to the `Progress` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Student_email_key";

-- AlterTable
ALTER TABLE "Progress" ADD COLUMN     "nic" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "age";

-- CreateIndex
CREATE UNIQUE INDEX "Progress_nic_key" ON "Progress"("nic");

-- CreateIndex
CREATE UNIQUE INDEX "Student_nic_key" ON "Student"("nic");

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_nic_fkey" FOREIGN KEY ("nic") REFERENCES "Student"("nic") ON DELETE RESTRICT ON UPDATE CASCADE;
