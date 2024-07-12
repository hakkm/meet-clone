"use server";

import {
  LoginInputs,
  LoginSchema,
  RegisterInputs,
  RegisterSchema,
} from "./definitions";
import { db } from "@/db";
import { users } from "@/db/schema";
import { saltAndHashPassword } from "@/lib/utils";
import { getUserByEmail } from "@/db/data/user";
import { signIn } from "@/auth";
import { DEFAULT_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

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
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error; // maybe bug with nextjs
  }
  // redirect(DEFAULT_REDIRECT);
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

  await db.insert(users).values({
    name: name,
    email: email,
    password: pwHash,
  });

  // todo: send verification token
  return { success: "User created. Check your email for verification token." };
}
