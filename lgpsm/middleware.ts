import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("lgpsm_access_token")?.value;
  const { pathname } = request.nextUrl;

  // Protect all dashboard, event creation, and user management routes
  const protectedRoutes = ["/dashboard", "/events", "/user-management"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/events/:path*", "/user-management/:path*"],
};
