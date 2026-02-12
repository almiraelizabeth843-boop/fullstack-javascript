import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

interface sendEmailParams {
  to: string;
  subject: string;
  text: string; // html
}

export async function sendEmail({to, subject, text} : sendEmailParams){
    try {
        const response = await resend.emails.send({
          from: "onboarding@resend.dev", // no-reply@furniture.com
          to,
          subject,
          text,
        });       
    } catch (error) {
        console.error("Error sending email:", error);
    }
}