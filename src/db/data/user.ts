import { db } from "@/db";
import { users } from "../schema";
import { sql } from "drizzle-orm";
import { User } from "@/app/_lib/definitions";

// todo: i think these functions should be cached

export async function getUserFromDb(
  email: string,
  pwHash: string,
): Promise<{ email: string; password: string | null } | null> {
  try {
    const user = await db
      .select({
        email: users.email,
        password: users.password,
      })
      .from(users)
      .where(sql`${users.email} = ${email} and ${users.password} = ${pwHash}`)
      .execute();
    return user[0];
  } catch {
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(sql`${users.email} = ${email}`);
    return user;
  } catch {
    return null;
  }
}

export async function getUserById(id: string): Promise<any> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(sql`${users.id} = ${id}`)
      .execute();
    return user;
  } catch {
    return null;
  }
}
