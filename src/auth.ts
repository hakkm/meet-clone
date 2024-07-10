// import NextAuth, { NextAuthConfig } from "next-auth";
// import google from "next-auth/providers/google"
//
//
// const _7days = 7 * 24 * 60 * 60;
// export const { auth, handlers, signIn, signOut } = NextAuth({
//   providers: [
//     google({
//       clientId: process.env.AUTH_GOOGLE_ID as string,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
//     }),
//   ],
//   session: {
//     strategy: 'jwt',
//     maxAge: _7days,
//   },
//   callbacks: {
//     // signIn, session callback
//     /// add something to session
//   },
//   secret: process.env.NEXTAUTH_SECRET as string,
//   pages: {
//     signIn: '/login',
//     verifyRequest: '/verify',
//     newUser: '/signup'
//   },
// });
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, Github, Discord],
  pages: {
    signIn: "/auth/login",
    newUser: "/auth//signup",
  },
});
