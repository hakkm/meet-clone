import { db } from "@/db"
import { users } from "../schema"
import { sql } from "drizzle-orm"
import { User } from "@/app/_lib/definitions"

export async function getUserFromDb(email: string, pwHash: string) {
  try {
    const user = await db.select({
      email: users.email,
      password: users.password,
    }).from(users).where(sql`${users.email} = ${email} and ${users.password} = ${pwHash}`).execute()
    return user
  } catch {
    return null
  }
}


export async function getUserByEmail(email: string): Promise<any> {
  const NO_USERS = 0
  try {
    const user = await db.select({
      email: users.email,
      password: users.password,
    }).from(users).where(sql`${users.email} = ${email}`)
    if (user.length === NO_USERS) {
      return null
    }
    return user
  } catch {
    return null
  }
}


export async function getUserById(id: string): Promise<any> {
  try {
    const user = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      password: users.password,
    }).from(users).where(sql`${users.id} = ${id}`).execute()
    return user
  } catch {
    return null
  }
}
