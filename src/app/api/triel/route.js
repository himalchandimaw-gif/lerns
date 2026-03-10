import prisma from "../../../../lib/prisma";
import dayjs from "dayjs";

export async function GET() {
  try {
    const startOfMonth = dayjs().startOf("month").toDate();
    const endOfMonth = dayjs().endOf("month").toDate();

    const students = await prisma.student.findMany({
      where: {
        trielDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      orderBy: {
        trielDate: "asc",
      },
    });

    return new Response(JSON.stringify(students), { status: 200 });
  } catch (error) {
    console.error("Error fetching this month trial students:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
