"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [qr, setQr] = useState(null);
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  // Fetch QR from API
  useEffect(() => {
    const fetchQR = async () => {
      const res = await fetch("/api/whatsapp");
      const data = await res.json();
      if (data.qr) setQr(data.qr);
    };
    fetchQR();

    const interval = setInterval(fetchQR, 10000); // refresh QR every 10s
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    setStatus("Sending...");
    const res = await fetch("/api/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number, message }),
    });
    const data = await res.json();
    if (data.success) setStatus("Message sent ✅");
    else setStatus("Failed ❌");
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>WhatsApp Web.js + Next.js</h1>

      {qr ? (
        <div>
          <p>Scan QR to login:</p>
          <img src={qr} alt="WhatsApp QR" width="300" />
        </div>
      ) : (
        <p>WhatsApp ready / QR scanned ✅</p>
      )}

      <div style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder="Phone number (e.g. 947XXXXXXXX)"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />
        <button onClick={sendMessage}>Send Message</button>
        <p>{status}</p>
      </div>
    </div>
  );
}
