import { AuthError, type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./app/_lib/definitions";
import { getUserByEmail } from "./db/data/user";
import bcrypt from "bcryptjs";
import Resend from "next-auth/providers/resend"
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, sessions, users, verificationTokens } from "./db/schema";
import { db } from "./db";


export class OAuthSignInError extends AuthError {
  static type = "OAuthSignInError";
  constructor() {
    super("User is signed in using OAuth");
  }
}

export default {
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
        console.log("authorize called");
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

          const isValidPassword = await bcrypt.compare(password, user.password!);
          if (!isValidPassword) {
            return null;
          }
          return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
