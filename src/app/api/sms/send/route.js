import https from "https";

export async function POST(req) {
  try {
    const { tp, message } = await req.json();

    if (!tp || !message) {
      return new Response(JSON.stringify({ error: "Phone number or message missing" }), { status: 400 });
    }

    // Format number: 0xxxx → 94xxxx
    let phone = tp.trim();
    if (phone.startsWith("0")) phone = "94" + phone.slice(1);

    const apiToken = "1476|MWKp6nz2qCg59WTivPvIlvSgMeDu28RZCloeqIGE4d985968";
    const smsUrl = `https://app.text.lk/api/http/?to=${phone}&message=${encodeURIComponent(message)}&api_token=${apiToken}`;

    // Send SMS
    const result = await new Promise((resolve, reject) => {
      https.get(smsUrl, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }).on("error", (err) => reject(err));
    });

    return new Response(JSON.stringify({ success: true, result }), { status: 200 });
  } catch (err) {
    console.error("SMS send error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
