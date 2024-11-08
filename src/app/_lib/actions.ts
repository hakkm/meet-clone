"use server";

import {
    ForgotPasswordInputs,
  ForgotPasswordSchema,
  LoginInputs,
  LoginSchema,
  NewPasswordInputs,
  NewPasswordSchema,
  RegisterInputs,
  RegisterSchema,
} from "./definitions";
import { db } from "@/db";
import { passwordResetToken, users, verificationTokens } from "@/db/schema";
import { saltAndHashPassword } from "@/lib/utils";
import { getUserByEmail } from "@/db/data/user";
import { signIn } from "@/auth";
import { DEFAULT_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generatePasswordResetToken, generateVerificationToken } from "@/lib/tokens";
import { sendResetPasswordEmail, sendVerificationEmail } from "@/lib/mail";
import { getVerificationToken } from "@/db/data/verification-token";
import { sql } from "drizzle-orm";
import { getPasswordResetTokenByToken } from "@/db/data/password-reset-token";

// output type for both login and register
type Output =
  | {
      success?: string;
      error?: string;
    }
  | undefined;

export async function login(values: LoginInputs): Promise<Output> {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  console.log({ existingUser });
  if (!existingUser) {
    return { error: "User does not exist." };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );
    sendVerificationEmail(verificationToken.identifier, verificationToken.token);
    return {
      success: "User not verified. Check your email for verification token.",
    };
  }

  try {
    console.log("Login Action Called");

    await signIn("credentials", {
      email,
      password,
      redirect: true, // todo: remove it if everything works
      redirectTo: DEFAULT_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        case "InvalidPassword":
          return { error: "Invalid credentials!" };
        case "OAuthSignInError":
          return { error: "Already signed in with OAuth!" };
        case "AccessDenied":
          return { error: "You're Not allowed to Log In" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error; // maybe bug with nextjs
  }
}

export async function register(values: RegisterInputs): Promise<Output> {
  console.log("Register Action Called");
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  const { email, password, name } = validatedFields.data!;
  const pwHash = await saltAndHashPassword(password);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "User already exists." };
  }

  try {
    await db.insert(users).values({
      name: name,
      email: email,
      password: pwHash,
    });
  } catch (error: any) {
    if (error.constraint === "email") return { error: "User already exists." };
  }

  const verificationToken = await generateVerificationToken(email);
  console.log({ verificationToken });

  sendVerificationEmail(verificationToken.identifier!, verificationToken.token);

  return { success: "User created. Check your email for verification token." };
}

export async function loginMagicLink(formData: FormData) {
  await signIn("resend", formData);
}


export async function verifyEmail(token: string): Promise<Output> {
  const verificationToken = await getVerificationToken(token);
  if (!verificationToken) {
    return { error: "Invalid token." };
  }

  const hasExpired = new Date(verificationToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };

  const existingUser = await getUserByEmail(verificationToken.identifier);
  if (!existingUser) {
    return { error: "User does not exist." };
  }

  await db
    .update(users)
    .set({ emailVerified: new Date(), email: verificationToken.identifier })
    .where(sql`${users.email} = ${verificationToken.identifier}`)
    .execute();

  await db
    .delete(verificationTokens)
    .where(sql`${verificationTokens.token} = ${token}`)
    .execute();

  // todo: when email verified redirect to DEFAULT_REDIRECT
  return { success: "Email verified." };
}

export async function resetPassword(values: ForgotPasswordInputs) {
  const validatedFields = ForgotPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Email." };
  }

  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "User does not exist." };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  sendResetPasswordEmail(passwordResetToken.identifier, passwordResetToken.token);
  return { success: "Check your email for password reset token." };
}

export async function newPassword(values: NewPasswordInputs, token: string) {
  if (!token) return { error: "Missing token." };

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  const { password } = validatedFields.data;
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Invalid token." };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };

  const existingUser = await getUserByEmail(existingToken.identifier);

  if (!existingUser) {
    return { error: "User does not exist." };
  }

  const pwHash = await saltAndHashPassword(password);

  await db.update(users).set({ password: pwHash }).where(sql`${users.email} = ${existingUser.email}`).execute();

  await db.delete(passwordResetToken).where(sql`${passwordResetToken.token} = ${token}`).execute();

  return { success: "Password reset successfully." };
}
