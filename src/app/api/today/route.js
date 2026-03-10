import prisma from "../../../../lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET(req) {
  try {
    const today = dayjs().tz("Asia/Colombo").format("YYYY-MM-DD");

    const students = await prisma.nextDate.findMany({
      where: {
        // Force match only by DATE (ignores UTC midnight shift)
        next: {
          gte: new Date(today + "T00:00:00+05:30"),
          lte: new Date(today + "T23:59:59+05:30"),
        },
      },
      include: {
        student: true,
      },
    });

    return new Response(JSON.stringify(students), { status: 200 });
  } catch (error) {
    console.error("Error fetching today's students:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch students" }),
      { status: 500 }
    );
  }
}
