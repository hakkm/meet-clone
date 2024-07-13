"use server";

import {
  LoginInputs,
  LoginSchema,
  RegisterInputs,
  RegisterSchema,
} from "./definitions";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { saltAndHashPassword } from "@/lib/utils";
import { getUserByEmail } from "@/db/data/user";
import { signIn } from "@/auth";
import { DEFAULT_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { OAuthSignInError } from "@/auth.config";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

// output type for both login and register
type Output = {
  success?: string;
  error?: string;
} | undefined;

export async function login(values: LoginInputs): Promise<Output> {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  console.log({existingUser});
  if (!existingUser) {
    return { error: "User does not exist." };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    sendVerificationEmail(verificationToken.email, verificationToken.token);
    return {success: "User not verified. Check your email for verification token."}
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
        case "OAuthSignInError":
          return { error: "Already signed in with OAuth!"}
        case "AccessDenied":
          return { error: "You're Not allowed to Log In"}
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
    if (error.constraint === "email")
      return { error: "User already exists." };
  }

  const verificationToken = await generateVerificationToken(email);
  console.log({ verificationToken });
  
  sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "User created. Check your email for verification token." };
}
