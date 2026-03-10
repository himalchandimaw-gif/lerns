import prisma from "../../../../../lib/prisma"; // adjust path to your prisma client

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const nic = searchParams.get("nic");

    if (!nic) return new Response(JSON.stringify({ error: "NIC required" }), { status: 400 });

    const schedules = await prisma.schedule.findMany({
      where: { studentNic: nic },
      orderBy: { date: "asc" },
    });

    return new Response(JSON.stringify(schedules), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching student schedule:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch schedule" }), { status: 500 });
  }
}
