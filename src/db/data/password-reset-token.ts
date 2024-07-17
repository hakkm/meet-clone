import { db } from "@/db";
import { sql } from "drizzle-orm";
import { passwordResetToken } from "../schema";
import { cache } from "react";

export const getPasswordResetTokenByEmail = cache(async (email: string) => {
  try {
    const [verificationToken] = await db
      .select()
      .from(passwordResetToken)
      .where(sql`${passwordResetToken.identifier} = ${email}`)
      .execute();
    return verificationToken;
  } catch {
    return null;
  }
});

export const getPasswordResetTokenByToken = cache(async (token: string) => {
  try {
    const [PasswordResetToken] = await db
      .select()
      .from(passwordResetToken)
      .where(sql`${passwordResetToken.token} = ${token}`)
      .execute();
    return PasswordResetToken;
  } catch {
    return null;
  }
});
