import z from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be 8 digit long.")
  .max(50, "Password must be 50 characters or less.")
  .regex(/[0-9]/, "Password must contain at least one digit.")
  .regex(/[a-z]/, "Password must contain at least one lowercase character.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase character.");
