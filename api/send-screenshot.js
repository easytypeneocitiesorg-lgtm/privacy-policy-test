export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).send("Method not allowed");

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl)
    return res.status(500).send("Webhook not configured");

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const form = new FormData();
    form.append("file", new Blob([buffer]), "results.png");

    await fetch(webhookUrl, {
      method: "POST",
      body: form
    });

    return res.status(200).send("Screenshot sent to Discord");
  } catch (err) {
    return res.status(500).send("Error: " + err.message);
  }
}
