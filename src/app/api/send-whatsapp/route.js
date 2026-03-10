// src/app/api/send-whatsapp/route.js
import { sendWhatsapp } from "@/lib/whatsappServer";

export async function POST(req) {
  try {
    const { phone, message } = await req.json();

    if (!sendWhatsapp) {
      return new Response(JSON.stringify({ error: "WhatsApp not ready" }), { status: 500 });
    }

    const result = await sendWhatsapp(phone, message);
    return new Response(JSON.stringify({ success: true, result }));
  } catch (err) {
    console.error("API Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}