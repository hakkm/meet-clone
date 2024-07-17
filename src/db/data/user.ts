import { db } from "@/db";
import { users } from "../schema";
import { sql } from "drizzle-orm";
import { User } from "@/app/_lib/definitions";
import { cache } from "react";

export const getUserFromDb = cache(
  async (
    email: string,
    pwHash: string,
  ): Promise<{ email: string; password: string | null } | null> => {
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
  },
);

export const getUserByEmail = cache(
  async (email: string): Promise<User | null> => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(sql`${users.email} = ${email}`);
      return user;
    } catch {
      return null;
    }
  },
);

export const getUserById = cache(async (id: string): Promise<any> => {
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
});
