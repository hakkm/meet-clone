import { cache } from "react";
import { verifySession } from "../_lib/sessions";
import { sql } from "@vercel/postgres";

export const getUser = cache(async () => {
  const session = await verifySession();

  const data = await sql`SELECT name, email FROM users WHERE id = ${session.userId}`;

  const user = data.rows[0]
  return user;
})
