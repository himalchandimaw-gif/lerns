import prisma from "../../../../lib/prisma";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { nic, status } = body;

    console.log("🔹 Received PUT:", nic, status); // log request

    const student = await prisma.student.update({
      where: { nic },
      data: { status },
    });

    console.log("✅ Updated student:", student); // log result

    return new Response(JSON.stringify(student), { status: 200 });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
