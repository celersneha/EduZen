import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/add-subject",
    "/attempt-test",
    "/dashboard",
    "/show-subjects",
    "/subject",
    "/syllabus",
    "/login",
    "/register",
    "/verify/:path*",
  ],
};

export async function middleware(request) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const { pathname } = request.nextUrl;

  // Protected student routes - require authentication
  const protectedStudentRoutes = [
    "/add-subject",
    "/attempt-test",
    "/dashboard",
    "/show-subjects",
    "/subject",
    "/syllabus",
  ];

  // Check if current path is a protected student route
  const isProtectedRoute = protectedStudentRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect unauthenticated users from protected routes to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users from auth pages to dashboard
  if (
    token &&
    (pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect authenticated users from home page to dashboard
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
