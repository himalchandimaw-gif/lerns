export const runtime = "nodejs";

import prisma from "../../../../lib/prisma.js";
import { sendWhatsapp } from "../../../../lib/whatsappServer.js";

// GET payments by NIC
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const nic = searchParams.get("nic");
    if (!nic)
      return new Response(JSON.stringify({ error: "NIC required" }), { status: 400 });

    const payments = await prisma.payment.findMany({
      where: { nic },
      orderBy: { installment: "asc" },
    });

    return new Response(JSON.stringify(payments), { status: 200 });
  } catch (err) {
    console.error("GET error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

// POST new or update existing payment
export async function POST(req) {
  try {
    const { nic, installment, amount } = await req.json();

    if (!nic || !installment || !amount)
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });

    // 1️⃣ Save or update payment
    let whatsappStatus = "pending";
    const payment = await prisma.payment.upsert({
      where: {
        nic_installment: { nic, installment: Number(installment) }, // composite unique key
      },
      update: { amount: parseFloat(amount), paidAt: new Date() },
      create: {
        nic,
        installment: Number(installment),
        amount: parseFloat(amount),
        paidAt: new Date(),
        whatsappStatus,
      },
    });

    // 2️⃣ Fetch student info
    const student = await prisma.student.findUnique({ where: { nic } });

    if (student?.tp) {
      const message = `Hello ${student.name}, ✅\nWe have received your payment of Rs.${amount} for installment ${installment}. Thank you!`;

      try {
        await sendWhatsapp(student.tp, message);
        whatsappStatus = "sent";
      } catch (err) {
        console.error("❌ WhatsApp send failed:", err);
        whatsappStatus = "failed";
      }

      // 3️⃣ Update payment with WhatsApp status
      await prisma.payment.update({
        where: { id: payment.id },
        data: { whatsappStatus },
      });
    } else {
      console.warn("⚠️ Student phone number not found for NIC:", nic);
    }

    return new Response(JSON.stringify({ ...payment, whatsappStatus }), { status: 201 });
  } catch (err) {
    console.error("POST /api/payments error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

// DELETE payment
export async function DELETE(req) {
  try {
    const { nic, installment } = await req.json();
    if (!nic || !installment)
      return new Response(JSON.stringify({ error: "NIC and installment required" }), { status: 400 });

    const deleted = await prisma.payment.deleteMany({
      where: { nic, installment: Number(installment) },
    });

    if (deleted.count === 0)
      return new Response(JSON.stringify({ error: "Payment not found" }), { status: 404 });

    return new Response(JSON.stringify({ message: "Payment cancelled" }), { status: 200 });
  } catch (err) {
    console.error("DELETE error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
