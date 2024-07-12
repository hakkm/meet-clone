import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { db } from "@/db";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { RegisterSchema } from "./app/_lib/definitions";
import { saltAndHashPassword } from "./lib/utils";
import { getUserFromDb } from "./db/data/user";
import authConfig from "@/auth.config"

export const { handlers: {GET, POST}, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  ...authConfig,
});
