import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ email, subject, message }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }

  return await resend.emails.send({
    from: "Bookstore <onboarding@resend.dev>",
    to: email,
    subject,
    text: message,
  });
};

export default sendEmail;
