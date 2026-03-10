-- AlterTable
ALTER TABLE "NextDate" ALTER COLUMN "last" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "trielDate" TIMESTAMP(3);
