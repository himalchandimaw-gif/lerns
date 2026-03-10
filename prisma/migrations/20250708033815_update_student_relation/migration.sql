/*
  Warnings:

  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `tp` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Progress" ALTER COLUMN "Doc" SET DEFAULT false,
ALTER COLUMN "exam_lec" SET DEFAULT false,
ALTER COLUMN "model_ex" SET DEFAULT false,
ALTER COLUMN "exam" SET DEFAULT false,
ALTER COLUMN "larner_permit" SET DEFAULT false,
ALTER COLUMN "steering_wh" SET DEFAULT false,
ALTER COLUMN "parts_of_v" SET DEFAULT false,
ALTER COLUMN "clutch_blnc" SET DEFAULT false,
ALTER COLUMN "gier_ch" SET DEFAULT false,
ALTER COLUMN "town_aria" SET DEFAULT false,
ALTER COLUMN "riverse" SET DEFAULT false,
ALTER COLUMN "training_on_yard" SET DEFAULT false,
ALTER COLUMN "find_tuning" SET DEFAULT false,
ALTER COLUMN "training_done" SET DEFAULT false,
ALTER COLUMN "triel" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "email",
DROP COLUMN "tp";
