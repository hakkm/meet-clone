import { NextRequest } from "next/server"
import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { API_AUTH_ROUTES, AUTH_ROUTES, DEFAULT_REDIRECT, PUBLIC_ROUTES } from "./routes"
 
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const {nextUrl} = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_ROUTES);
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = Object.values(AUTH_ROUTES).includes(nextUrl.pathname);
  
  if (isApiAuthRoute) return

  if (isAuthRoute) {
    if (isLoggedIn) return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl.origin));
    return null;
  }

  if (!isLoggedIn && !isPublicRoute)
    return Response.redirect(new URL(AUTH_ROUTES.LOGIN, nextUrl.origin));
})

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
