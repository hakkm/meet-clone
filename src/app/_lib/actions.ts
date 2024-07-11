"use server";

import { signIn } from "@/auth";
import {
  LoginInputs,
  LoginSchema,
  Provider,
  RegisterInputs,
} from "./definitions";
import { db } from "@/db";
import { users } from "@/db/schema";


export async function login({ email, password }: LoginInputs) {
  const validatedFields = LoginSchema.safeParse({ email, password });
}

export async function register(values: RegisterInputs) {
  const validatedFields = LoginSchema.safeParse(values);
  console.log("Register");
  await db.insert(users).values({
    name: values.name,
    email: values.email,
    password: values.password,
  });
}
