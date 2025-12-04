export const config = {
  api: {
    bodyParser: false, // disable default parser to handle raw data
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return res.status(500).send("Webhook not configured");

  try {
    // Read raw data from request
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawData = Buffer.concat(chunks);

    // Send to Discord as file
    const formData = new FormData();
    formData.append("file", new Blob([rawData]), "result.png");

    await fetch(webhookUrl, {
      method: "POST",
      body: formData,
    });

    return res.status(200).send("Image sent to Discord");
  } catch (err) {
    return res.status(500).send("Error sending image: " + err.message);
  }
}
