"use server";

import bcrypt from "bcrypt";
import { sql } from "@vercel/postgres";

import { SignupFormSchema } from "@/app/_lib/definitions";

export async function signup(prevState: any, formData: FormData) {
  // 1. validate the fields
  const validationResults = SignupFormSchema.safeParse({
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!validationResults.success) {
    return { errors: validationResults.error.flatten().fieldErrors };
  }

  const { name, email, password } = validationResults.data;

  // 2. create user
  const hashedPassword = await bcrypt.hash(password, 10);

  // hanle this error :  NeonDbError: duplicate key value violates unique constraint "users_email_key"
  const data =
    await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hashedPassword}) RETURNING *`;

  const user = data.rows[0];
  console.log(user);

  // 3. create session
}
