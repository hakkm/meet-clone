import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { db } from "@/db";
import authConfig from "@/auth.config";
import { sql } from "drizzle-orm";
import { getUserByEmail, getUserById } from "./db/data/user";

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
    // Use the signIn() callback to control if a user is allowed to sign in.
    async signIn({ user, account }) {
      // todo: if you've added any other provider other than credentials check if this is OK
      console.log("auth.ts: Async Sign In Called");

      const authNeedEmailVerification = account?.provider === "credentials";
      if (!authNeedEmailVerification) {
        console.log("auth.ts: Allowed to sign in");
        return true;
      }

      const existingUser = await getUserById(user.id!);

      const accountVerified = existingUser?.emailVerified;
      if (!accountVerified) {
        console.log("auth.ts: Unallowed to sign in");
        return false;
      }

      console.log("auth.ts: Allowed to sign in");
      return true;
    },
    async session({ session, token }) {
      console.log("auth.ts: session callback called")
      if (session.user && token.sub) session.user.id = token.sub;
      // console.log({ sessionFromSession: session });
      // console.log({ tokenFromSession: token });
      return session;
    },
    // async jwt({ token, user }) {
    //   // console.log({ tokenFromJwt: token });
    //   // console.log({ userToken: user });
    //   return token;
    // },
  },
  ...authConfig,
});
