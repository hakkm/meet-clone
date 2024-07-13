import { users, verificationTokens } from "@/db/schema";
import { z } from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export type RegisterInputs = z.infer<typeof RegisterSchema>;

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password field must not be empty." }),
});

export type User = typeof users.$inferSelect; // return type when queried
export type VerificationToken = typeof verificationTokens.$inferSelect;

export type Provider = "email" | "google" | "discord" | "github";

export const LoginSchema = z.object({
  email: z
    .string({
      message: "Email is required.",
    })
    .email({
      message: "Please enter a valid email.",
    }),
  password: z.string().min(1, {
    message: "Password is required.",
  }), // use filters anywhere but for password in login
});

export type LoginInputs = z.infer<typeof LoginSchema>;
