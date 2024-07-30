import NextAuth from "next-auth"
import { NextRequest, NextResponse } from "next/server";
import authConfig from "@/auth.config"
import { API_AUTH_ROUTES, AUTH_ROUTES, DEFAULT_REDIRECT, PUBLIC_ROUTES } from "./routes"
 
const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
  const {nextUrl} = req;
  const isLoggedIn = !!req.cookies.get("authjs.session-token")
  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_ROUTES);
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = Object.values(AUTH_ROUTES).includes(nextUrl.pathname);
  // console.log({nextUrl});
  // console.log("middleware.ts: pathname: ", nextUrl.pathname)
  // console.log({auth: req.cookies});
  
  // console.log({isLoggedIn});
  
  
  
  if (isApiAuthRoute) return

  if (isAuthRoute) {
    console.log("middleware.ts: it is Auth Route");
    if (isLoggedIn) {
      console.log("middleware.ts: it is Auth Route and Logged In => go to setting.tsx");
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT, nextUrl.origin));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute)
    return NextResponse.redirect(new URL(AUTH_ROUTES.LOGIN, nextUrl.origin));

  // if (!req.auth && req.nextUrl.pathname !== "/auth/login") {
  //   const newUrl = new URL("/auth/login", req.nextUrl.origin)
  //   return Response.redirect(newUrl)
  // }
  console.log("middleware.ts: Route Continue");
  
})

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
