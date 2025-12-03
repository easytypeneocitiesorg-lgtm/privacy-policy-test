export default function handler(req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(`
Your Privacy Policy Goes Here.
Add whatever text you want.

You can update this file anytime.
  `);
}
