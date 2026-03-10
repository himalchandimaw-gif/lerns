import prisma from "../../../../lib/prisma";

export async function PUT(req) {
  try {
    const { nic, field, value } = await req.json();

    let updateData = { [field]: value };

    // Special case: trial button → also update trielDate
    if (field === "triel") {
      updateData.trielDate = value ? new Date() : null; 
    }

    const updated = await prisma.student.update({
      where: { nic },
      data: updateData,
    });

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    console.error("❌ Error updating student progress:", err);
    return new Response(JSON.stringify({ error: "Failed to update student progress" }), { status: 500 });
  }
}
