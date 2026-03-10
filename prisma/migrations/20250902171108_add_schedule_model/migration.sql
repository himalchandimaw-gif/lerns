-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "slot" INTEGER NOT NULL,
    "studentNic" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_date_slot_studentNic_key" ON "Schedule"("date", "slot", "studentNic");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_studentNic_fkey" FOREIGN KEY ("studentNic") REFERENCES "Student"("nic") ON DELETE RESTRICT ON UPDATE CASCADE;
