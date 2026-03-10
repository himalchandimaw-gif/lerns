import prisma from "../../../../lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    if (!date) return new Response(JSON.stringify([]));

    const schedules = await prisma.schedule.findMany({
      where: {
        date: {
          gte: new Date(date + "T00:00:00.000Z"),
          lt: new Date(date + "T23:59:59.999Z"),
        },
      },
      include: { student: true },
      orderBy: { slot: "asc" },
    });

    return new Response(JSON.stringify(schedules), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch schedule" }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { date, slot, nic } = await req.json();
    await prisma.schedule.delete({
      where: {
        date_slot_studentNic: {
          date: new Date(date),
          slot,
          studentNic: nic,
        },
      },
    });
    return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to delete schedule" }), { status: 500 });
  }
}
