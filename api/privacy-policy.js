export default function handler(req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(`
Privacy Policy

Effective Date: December 3, 2025

This Privacy Policy (“Policy”) governs the collection, use, and dissemination of data through the use of this website (the “Site”). By accessing or using the Site, users (“You”) acknowledge and consent to the practices described herein.

1. Data Collection
During your interaction with the Site, automated processes may capture visual representations (screenshots) of the rendered content within your web browser. Such captures are intended solely to document and record activity occurring on the Site. Screenshots may include textual, graphical, and interface elements presented at the time of capture.

2. Data Transmission and Storage
Captured screenshots are transmitted to a designated Discord server controlled by the Site administrators. Screenshots are processed and stored in accordance with internal administrative protocols. All transmissions occur over secure protocols to preserve data integrity during transit. Access to collected screenshots is limited to authorized administrative personnel.

3. Consent and Acknowledgment
By continuing to access or utilize the Site, You explicitly consent to the capture, transmission, and storage of screenshots as described herein. Your use of the Site constitutes acknowledgment and agreement to the terms set forth in this Policy. Users who do not consent to these practices are advised to cease using the Site immediately.

4. Security
The Site implements reasonable administrative and technical measures to protect the integrity and security of collected data. However, You acknowledge that no system is completely impervious to unauthorized access, and You assume all risk associated with the transmission and storage of captured screenshots.

5. Modifications
The Site reserves the right to modify, update, or amend this Policy at any time. Modifications will become effective immediately upon posting to the Site. Continued access or use of the Site constitutes acceptance of any revised terms.


By accessing or using this Site, You acknowledge that You have read, understood, and agreed to this Privacy Policy.

  `);
}
