import { db } from "@/db"
import { sql } from "drizzle-orm"
import { verificationTokens } from "../schema"

export async function getVerificationEmail(email: string) {
  try {
    const verificationToken = await db.select().from(verificationTokens).where(sql`${verificationTokens.email} = ${email}`).execute()
    return verificationToken
  } catch {
    return null
  }
}


export async function getVerificationToken(token: string) {
  try {
    const verificationToken = await db.select().from(verificationTokens).where(sql`${verificationTokens.token} = ${token}`).execute()
    return verificationToken
  } catch {
    return null
  }
}
