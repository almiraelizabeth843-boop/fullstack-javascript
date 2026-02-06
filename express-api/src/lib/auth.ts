import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";

import prisma from "./prisma";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
   plugins: [
        emailOTP({ 
            async sendVerificationOTP({ email, otp, type }) { 
              const subjects: Record<string, string> = {
                "email-verification": "Verify your email",
                "forget-password": "Reset your password",
              };
                await sendEmail({
                  to: email,
                  subject: subjects[type] || "Verify your email",
                  text: `Your verification code is ${otp}. This code will expire in 10 minutes.`,
                 });
            },             
        })
      ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account"
    },
  },
  trustedOrigins: ["http://localhost:5173"],
});
