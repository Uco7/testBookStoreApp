import nodemailer from "nodemailer";
import  dotenv from "dotenv"
    dotenv.config()
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Or your preferred service
    auth: {
      user: process.env.EMAIl,
      pass: process.env.EMAIL_PASSWORD, // Use an "App Password," not your real password
    },
  });

  const mailOptions = {
    from: `Bookstore App <${process.env.EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;