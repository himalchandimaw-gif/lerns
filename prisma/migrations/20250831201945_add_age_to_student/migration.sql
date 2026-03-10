/*
  Warnings:

  - You are about to drop the `Progress` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nic]` on the table `NextDate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nic` to the `NextDate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_nic_fkey";

-- AlterTable
ALTER TABLE "NextDate" ADD COLUMN     "nic" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "age" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "doc" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "exam" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "exam_lec" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tp" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "triel" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT true;

-- DropTable
DROP TABLE "Progress";

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "nic" TEXT NOT NULL,
    "installment" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_nic_installment_key" ON "Payment"("nic", "installment");

-- CreateIndex
CREATE UNIQUE INDEX "NextDate_nic_key" ON "NextDate"("nic");

-- AddForeignKey
ALTER TABLE "NextDate" ADD CONSTRAINT "NextDate_nic_fkey" FOREIGN KEY ("nic") REFERENCES "Student"("nic") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_nic_fkey" FOREIGN KEY ("nic") REFERENCES "Student"("nic") ON DELETE RESTRICT ON UPDATE CASCADE;
