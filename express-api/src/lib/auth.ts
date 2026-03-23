import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, admin } from "better-auth/plugins";
import { createAuthMiddleware, APIError } from "better-auth/api";

import prisma from "./prisma";
import { sendEmail } from "./email";
import { passwordSchema } from "./validation";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // maxPasswordLength: 50,  //password length ကို 50 character ထိ သတ်မှတ်ခြင်း
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log(`Password reset requested for: ${user.email}`);
      console.log(`Generated reset URL: ${url}`);
      
      const text = `Hello,\n\nWe received a request to reset your password for your Furniture Shop account. You can set a new password by clicking the link below:\n\n${url}\n\nIf you did not request this, please ignore this email. This link will expire in 60 minutes.\n\nBest regards,\nFurniture Shop`;

      // Better Auth recommends NOT awaiting the email sending to prevent timing attacks
      sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: text,
      }).then(res => {
        console.log("Email sent successfully:", res);
      }).catch(err => {
        console.error("Failed to send reset email:", err);
      });
    },
  },
  plugins: [
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const subjects: Record<string, string> = {
          "email-verification": "Verify your email",
          "forget-password": "Reset your password",
        };
        void sendEmail({
          to: email,
          subject: subjects[type] || "Verify your email",
          text: `Your verification code is ${otp}. This code will expire in 10 minutes.`,
        });
      },
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path == "/sign-up/email" ||
        ctx.path == "/reset-password" ||
        ctx.path == "/change-password"
      ) {
        const password = ctx.body.password || ctx.body.newPassword;
        const { error } = passwordSchema.safeParse(password);
        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password is not strong enough!",
          });
        }
      }
    }),
  },
  trustedOrigins: ["http://localhost:5173"],
});
