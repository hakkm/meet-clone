import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/profile"];

export default withAuth(
  async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isAuthRoute = path.startsWith("/auth");

    const isAuth = await getToken({
      req,
      secret: process.env.JWT_SECRET,
    });

    if (isProtectedRoute && !isAuth) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    console.log(isAuth);
    if (isAuth && isAuthRoute) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  },

  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  },
);

// Routes Middleware should not run on
export const config = {
  matcher: ["/profile/:path*", "/auth/:path*"],
};
