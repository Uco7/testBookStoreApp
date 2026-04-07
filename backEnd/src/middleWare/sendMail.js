// import dotenv from "dotenv";
// dotenv.config();

// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);
// console.log("Resend API Key:", process.env.RESEND_API_KEY ? "Loaded" : "Not Loaded");

// const sendEmail = async ({ to, subject, html }) => {
//   try {
//     const data = await resend.emails.send({
//       from: "BookStore <noreply@uchetechub.store>", // ✅ FIXED
//       to,
//       subject,
//       html,
//     });

//     return data;
//   } catch (error) {
//     console.error("Email error:", error);
//     throw error;
//   }
// };

// export default sendEmail;

import dotenv from "dotenv"

dotenv.config()
import {Resend} from "resend"
const resend=new Resend(process.env.RESEND_API_KEY)
console.log("resesnd api",process.env.RESEND_API_KEY)

const sendMail=async({to,subject,html})=>{
  try {
    const data=await resend.emails.send({
      from:"bookStore app <noreply@uchetechub.store>",
      to, 
      subject,
      html
    });
    console.log("data of send mail",data)
    return data
    
  } catch (error) {
    console.log("error in sending mail",error)
    throw error
    
  }
}
export default sendMail