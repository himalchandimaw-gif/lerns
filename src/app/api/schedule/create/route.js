import prisma from "../../../../../lib/prisma";
import { sendWhatsapp } from "../../../../../lib/whatsappServer"; // adjust path

export async function POST(req) {
  try {
    const { date, slot, nic } = await req.json();

    // Prevent duplicates
    const existing = await prisma.schedule.findUnique({
      where: { date_slot_studentNic: { date: new Date(date), slot, studentNic: nic } },
    });
    if (existing) {
      return new Response(JSON.stringify({ message: "Already scheduled" }), { status: 400 });
    }

    // Create schedule
    const schedule = await prisma.schedule.create({
      data: { date: new Date(date), slot, studentNic: nic },
      include: { student: true }, // fetch student info
    });

    // Send WhatsApp message
    const timeSlots = [
      "7:30-8:30",
      "8:30-9:30",
      "9:30-10:30",
      "10:30-11:30",
      "11:30-12:30",
      "1:30-2:30",
      "2:30-3:30",
      "3:30-4:30",
      "4:30-5:30",
    ];

    const student = schedule.student;

    const message = `📅 Hello ${student.name}!
You have been scheduled for a lesson.

🗓 Date: ${new Date(schedule.date).toLocaleDateString()}
⏰ Time Slot: ${timeSlots[schedule.slot - 1]}
📦 Package: ${student.package || "Not selected"}`;

    try {
      await sendWhatsapp(student.tp, message);
      console.log("📩 WhatsApp message sent to", student.tp);
    } catch (err) {
      console.error("⚠️ WhatsApp message failed:", err);
    }

    return new Response(JSON.stringify(schedule), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to create schedule" }), { status: 500 });
  }
}
