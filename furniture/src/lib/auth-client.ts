import { createAuthClient } from "better-auth/react";
import { emailOTPClient, adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:8080",
  fetchOptions: {
    credentials: "include", // Include cookies in requests
  },
  plugins: [adminClient(), emailOTPClient()],
});

export const { signIn, signUp, signOut, useSession, emailOtp } = authClient;
