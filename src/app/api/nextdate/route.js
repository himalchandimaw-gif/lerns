import prisma from "../../../../lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const nic = searchParams.get("nic");

    if (!nic) {
      return new Response(JSON.stringify({ error: "NIC is required" }), { status: 400 });
    }

    const record = await prisma.nextDate.findUnique({
      where: { nic }, // Make sure `nic` exists in your NextDate table
      include: { student: true },
    });

    return new Response(JSON.stringify(record || {}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ NextDate API GET error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { nic, nextDate } = await req.json();
    if (!nic || !nextDate) {
      return new Response(JSON.stringify({ error: "NIC and nextDate are required" }), { status: 400 });
    }

    const existing = await prisma.nextDate.findUnique({ where: { nic } });

    let updated;
    if (existing) {
      // Update
      updated = await prisma.nextDate.update({
        where: { nic },
        data: { last: existing.next, next: new Date(nextDate) },
      });
    } else {
      // Create
      updated = await prisma.nextDate.create({
        data: {
          nic,
          next: new Date(nextDate),
          last: null,
        },
      });
    }

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ NextDate API POST error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
