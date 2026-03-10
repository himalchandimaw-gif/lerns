-- CreateTable
CREATE TABLE "Progress" (
    "id" SERIAL NOT NULL,
    "Doc" BOOLEAN NOT NULL,
    "exam_lec" BOOLEAN NOT NULL,
    "model_ex" BOOLEAN NOT NULL,
    "exam" BOOLEAN NOT NULL,
    "larner_permit" BOOLEAN NOT NULL,
    "steering_wh" BOOLEAN NOT NULL,
    "parts_of_v" BOOLEAN NOT NULL,
    "clutch_blnc" BOOLEAN NOT NULL,
    "gier_ch" BOOLEAN NOT NULL,
    "town_aria" BOOLEAN NOT NULL,
    "riverse" BOOLEAN NOT NULL,
    "training_on_yard" BOOLEAN NOT NULL,
    "find_tuning" BOOLEAN NOT NULL,
    "training_done" BOOLEAN NOT NULL,
    "triel" BOOLEAN NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NextDate" (
    "id" SERIAL NOT NULL,
    "next" TIMESTAMP(3) NOT NULL,
    "last" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NextDate_pkey" PRIMARY KEY ("id")
);
