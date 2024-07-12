import { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./app/_lib/definitions";
import { getUserByEmail } from "./db/data/user";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Google,
    Github,
    Discord,
    Credentials({
      // The Credentials provider is designed to forward any credentials inserted into the login form (.i.e username/password) to your authentication service via the authorize callback on the provider configuration.
      async authorize(credentials) {
        console.log("authorize called");
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const data = await getUserByEmail(email);
          const user = data? data[0] : null;

          const isLoggedInUsingOAuth = !user?.password;
          const badCredentials = !user || isLoggedInUsingOAuth;
          if (badCredentials) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(password, user.password);
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
