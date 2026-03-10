// whatsappServerNode.mjs
import express from "express";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import open from "open";

const app = express();
app.use(express.json());

let ready = false;
let queue = [];

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: ".wwebjs_auth" }),
  puppeteer: {
    headless: false, // better to see the browser first
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});


// QR code event
client.on("qr", async (qr) => {
  const dataUrl = await QRCode.toDataURL(qr);
  const html = `
    <html>
      <body style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;">
        <h1>Scan QR to login WhatsApp</h1>
        <img src="${dataUrl}" />
      </body>
    </html>
  `;
  const filePath = path.join(process.cwd(), "whatsapp-qr.html");
  fs.writeFileSync(filePath, html);
  open(filePath);
  console.log("📲 QR code opened in browser");
});

// Client ready
client.on("ready", () => {
  ready = true;
  console.log("✅ WhatsApp client ready");

  // Flush queued messages
  queue.forEach(({ phone, message }) => send(phone, message));
  queue = [];
});

// Disconnected
client.on("disconnected", (reason) => {
  ready = false;
  console.warn("⚠️ WhatsApp disconnected:", reason);
  setTimeout(() => client.initialize(), 2000);
});

client.initialize();

// Send message function
async function send(phone, message) {
  const chatId = phone.includes("@c.us") ? phone : `${phone.replace(/\D/g, "")}@c.us`;
  if (!ready) {
    queue.push({ phone, message });
    return { status: "queued" };
  }
  return client.sendMessage(chatId, message);
}

// REST API
app.post("/send", async (req, res) => {
  try {
    const { phone, message } = req.body;
    const result = await send(phone, message);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`📡 WhatsApp server running on port ${PORT}`));
