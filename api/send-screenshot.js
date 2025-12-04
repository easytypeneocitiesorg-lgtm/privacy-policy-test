// api/send-screenshot.js
export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return res.status(500).send("Webhook not configured");

  try {
    // Read raw binary from request (FormData sent from browser)
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    // Build a multipart/form-data POST to Discord
    // Use fetch with native FormData/Blob in Node 18+ (Vercel runtime supports this)
    const form = new FormData();
    // Node's FormData + Blob are available in Vercel runtime; if not, this still often works.
    form.append("file", new Blob([buffer]), "results.png");

    await fetch(webhookUrl, {
      method: "POST",
      body: form
    });

    res.status(200).send("Screenshot sent to Discord");
  } catch (err) {
    console.error("send-screenshot error:", err);
    res.status(500).send("Error sending screenshot: " + (err && err.message));
  }
}
