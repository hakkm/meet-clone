import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { User } from "./definitions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

const key = process.env.AUTH_SECRET;
const secret = new TextEncoder().encode(key);
const alg = "HS256";

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, secret, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}

export async function createSession(userId: User["id"]) {
  const week = 1000 * 60 * 60 * 24 * 7;
  // const _30sec = 1000 * 30;
  const expiresAt = new Date(Date.now() + week);
  // create session
  const session = await encrypt({ userId, expires: expiresAt });

  // save the sesion in a cookie
  cookies().set("session", session, { expires: expiresAt, httpOnly: true });
}

export const verifySession = cache(async () => {
  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)
 
  if (!session?.userId) {
    redirect('/login')
  }
 
  return { isAuth: true, userId: Number(session.userId) }
})
