"use server";

import { LoginFormSchema, User } from "@/app/_lib/definitions";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import { createSession, encrypt } from "@/app/_lib/sessions";
import { redirect } from "next/navigation";

export async function login(_prevState: any, formData: FormData) {
  // 1. validate the fields
  const validationResults = LoginFormSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!validationResults.success) {
    return { errors: validationResults.error.flatten().fieldErrors };
  }

  const { email, password } = validationResults.data;

  // 2. authenticate the user
  const data = await sql<User>`SELECT * FROM users WHERE email = ${email}`;
  const user = data.rows[0];

  if (!user) {
    return { errors: { email: "User not found." } };
  }

  if(!(await bcrypt.compare(password, user.password))) {
    return { errors: { password: "Incorrect password." } };
  }

  console.log("User authenticated.");
  
  // 3. create session
  await createSession(user.id);
  redirect("/")

}
