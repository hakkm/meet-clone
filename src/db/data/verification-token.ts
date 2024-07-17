import { db } from "@/db";
import { sql } from "drizzle-orm";
import { verificationTokens } from "../schema";
import { cache } from "react";

export const getVerificationEmail = cache(async (email: string) => {
  try {
    const verificationToken = await db
      .select()
      .from(verificationTokens)
      .where(sql`${verificationTokens.identifier} = ${email}`)
      .execute();
    return verificationToken;
  } catch {
    return null;
  }
});

export const getVerificationToken = cache(async (token: string) => {
  try {
    const [verificationToken] = await db
      .select()
      .from(verificationTokens)
      .where(sql`${verificationTokens.token} = ${token}`)
      .execute();
    return verificationToken;
  } catch {
    return null;
  }
});
