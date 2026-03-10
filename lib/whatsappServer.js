// lib/whatsappServer.js
import { Client, LocalAuth } from "whatsapp-web.js";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import open from "open";

let client;
let ready = false;
let messageQueue = [];
let latestQR = null;

export let sendWhatsapp;
export let getQR;

export function initWhatsAppClient() {
  if (client) {
    try { client.destroy(); } catch (err) { console.warn(err.message); }
  }

  client = new Client({
    authStrategy: new LocalAuth({ dataPath: ".wwebjs_auth" }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    },
  });

  client.on("qr", async (qr) => {
    latestQR = await QRCode.toDataURL(qr);

    const html = `
      <html>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;">
          <h1>Scan QR to login WhatsApp</h1>
          <img src="${latestQR}" />
        </body>
      </html>
    `;
    const filePath = path.join(process.cwd(), "whatsapp-qr.html");
    fs.writeFileSync(filePath, html);
    open(filePath);
    console.log("📲 QR code opened in browser");
  });

  client.on("ready", () => {
    ready = true;
    latestQR = null;
    console.log("✅ WhatsApp client ready");

    if (messageQueue.length > 0) {
      const toSend = [...messageQueue];
      messageQueue = [];
      toSend.forEach(({ phone, message }) => sendWhatsapp(phone, message));
    }
  });

  client.on("auth_failure", (msg) => console.error("❌ Auth failure:", msg));
  client.on("disconnected", (reason) => {
    ready = false;
    console.warn("⚠️ WhatsApp disconnected:", reason);
    setTimeout(() => initWhatsAppClient(), 2000);
  });

  client.initialize();

  sendWhatsapp = async (phone, message) => {
    if (!client) throw new Error("WhatsApp client not initialized");

    const chatId = phone.includes("@c.us") ? phone : `${phone.replace(/\D/g, "")}@c.us`;

    if (!ready) {
      messageQueue.push({ phone, message });
      return { status: "queued", phone, message };
    }

    try {
      const msg = await client.sendMessage(chatId, message);
      console.log("📩 Message sent to", chatId);
      return msg;
    } catch (err) {
      console.error("❌ Send error:", err.message);
      if (err.message.includes("Session closed")) {
        messageQueue.push({ phone, message });
        ready = false;
        initWhatsAppClient();
      }
      throw err;
    }
  };

  getQR = () => ({ qr: latestQR, ready });
}

// Initialize immediately on server start
initWhatsAppClient();