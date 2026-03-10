import prisma from "../../../../lib/prisma";

export async function PUT(req) {
  try {
    const { nic, pkg } = await req.json();

    const student = await prisma.student.update({
      where: { nic },
      data: { package: pkg },
    });

    return new Response(JSON.stringify(student), { status: 200 });
  } catch (err) {
    console.error("❌ Error updating package:", err);
    return new Response(
      JSON.stringify({ error: "Failed to update package" }),
      { status: 500 }
    );
  }
}
