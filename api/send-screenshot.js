import fetch from "node-fetch";

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if(req.method!=="POST") return res.status(405).send("Method Not Allowed");

  const data = await new Promise(resolve => {
    const chunks=[];
    req.on("data", chunk=>chunks.push(chunk));
    req.on("end", ()=>resolve(Buffer.concat(chunks)));
  });

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if(!webhookUrl) return res.status(500).send("Webhook not configured");

  await fetch(webhookUrl,{
    method:"POST",
    headers: { "Content-Type":"application/octet-stream" },
    body:data
  });

  res.status(200).send("Screenshot sent");
}
