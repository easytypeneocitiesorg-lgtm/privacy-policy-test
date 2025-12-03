export default function handler(req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(`
Privacy Policy

Welcome! We value your trust and want to be transparent about how we handle data while you use this site.

1. Screenshots
By using this website, you acknowledge that the site may take screenshots of the pages you visit. These screenshots are automatically sent to a Discord server managed by the site owner.

2. Purpose
Screenshots are used solely for monitoring and improving the website experience. No personal information, account details, or sensitive data is intentionally collected.

3. Cookies & Tracking
This site does not use cookies, tracking pixels, or other analytics tools. Only screenshots are taken as described above.

4. Your Choices
If you do not wish to have your activity captured in screenshots, you may choose not to use the site. There is no way to opt-out once you interact with the site other than leaving it.

By continuing to use this website, you agree to the terms described in this privacy policy.

  `);
}
