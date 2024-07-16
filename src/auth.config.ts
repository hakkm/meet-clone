import { AuthError, type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./app/_lib/definitions";
import { getUserByEmail } from "./db/data/user";
import bcrypt from "bcryptjs";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, sessions, users, verificationTokens } from "./db/schema";
import { db } from "./db";
import { sql } from "drizzle-orm";

export class OAuthSignInError extends AuthError {
  static type = "OAuthSignInError";
  constructor() {
    super("User is signed in using OAuth");
  }
}

export class InvalidPasswordError extends AuthError {
  static type = "InvalidPassword";
  constructor() {
    super("Invalid credentials");
  }
}

export default {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    // get called when a user is created with oauth
    async linkAccount({ user }) {
      console.log({ user_link_acount: user });
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(sql`${users.id} = ${user.id}`)
        .execute();
      console.log("Account linked successfully");
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Resend({
      from: "onboarding@resend.dev",
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      allowDangerousEmailAccountLinking: true,
    }),
    Discord({
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      // The Credentials provider is designed to forward any credentials inserted into the login form (.i.e username/password) to your authentication service via the authorize callback on the provider configuration.
      async authorize(credentials) {
        console.log("auth.config.ts: authorize called");
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          console.log("validatedFields");
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user) {
            return null;
          }

          const isLoggedInUsingOAuth = !user.password;
          if (isLoggedInUsingOAuth) {
            throw new OAuthSignInError();
          }

          const isValidPassword = await bcrypt.compare(
            password,
            user.password!,
          );
          if (!isValidPassword) {
            throw new InvalidPasswordError();
          }
          console.log("auth.config.ts: you're authorized");
          return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
