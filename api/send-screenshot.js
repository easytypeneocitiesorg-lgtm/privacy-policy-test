import formidable from "formidable";
import fs from "fs";
import fetch from "node-fetch";

export const config = { api: { bodyParser: false } };

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).send("Method not allowed");

  const form = new formidable.IncomingForm();
  form.parse(req, async(err, fields, files)=>{
    if(err) return res.status(500).send(err);

    const filePath = files.file.filepath;
    const fileData = fs.readFileSync(filePath);
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if(!webhookUrl) return res.status(500).send("Webhook not configured");

    await fetch(webhookUrl,{
      method:"POST",
      headers:{},
      body:fileData
    });

    res.status(200).send("Result image sent");
  });
}
