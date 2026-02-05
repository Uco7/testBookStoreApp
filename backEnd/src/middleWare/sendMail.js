import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail", // Or "SMTP" if using another provider
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // App password for Gmail or SMTP password
  },
});

const sendEmail = async ({ email, subject, message }) => {
  try {
    const mailOptions = {
      from: `"Bookstore App" <${process.env.EMAIL}>`,
      to: email,
      subject,
      text: message,
      // optional: html: "<p>HTML version of your message</p>"
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email send failed:", err);
    throw err;
  }
};

export default sendEmail;
