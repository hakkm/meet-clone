import { db } from '@/db';
import { getVerificationEmail } from '@/db/data/verification-token';
import { verificationTokens } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function generateVerificationToken(email: string) {
  const token = uuidv4()
  const _1hour = 60 * 60 * 1000
  const expires = new Date(Date.now() + _1hour)

  const existingToken = await getVerificationEmail(email);

  console.log("Existing token: ", existingToken);
  

  if (existingToken) {
    console.log("Existing token found, deleting it");
    await db.delete(verificationTokens).where(sql`${verificationTokens.identifier} = ${email}`).execute()
  }

  const [verificationToken] = await db.insert(verificationTokens).values({
    identifier: email,
    token: token,
    expires: expires,
  }).returning()

  return verificationToken
}
