import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { db } from "@/db";
import authConfig from "@/auth.config";
import { sql } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      // console.log({ sessionFromSession: session });
      // console.log({ tokenFromSession: token });
      return session;
    },
    async jwt({ token, user }) {
      // console.log({ tokenFromJwt: token });
      // console.log({ userToken: user });
      return token;
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  ...authConfig,
});
