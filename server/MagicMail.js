const dotenv = require("dotenv");
dotenv.config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'gmail', // Replace with your SMTP server
    port: 587, // Use 587 for TLS/STARTTLS or 465 for SSL
    secure: false, // Set to true if using port 465
    auth: {
      user: process.env.MAIL, // Correct usage of process.env
      pass: 'xvtv iyuy yinb ypah', // Correct usage of process.env
    },
  });

async function main() {
  try {
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" Fullstacktest353@gmail.com',
      to: "moidinhishan@gmail.com",
      subject: "Hello ✔",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

main();
