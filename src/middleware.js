import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/student/:path*",
    "/teacher/:path*",
    "/login",
    "/register",
    "/verify/:path*",
  ],
};

export async function middleware(request) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const { pathname } = request.nextUrl;

  // Protected student routes - require student role
  const isStudentRoute = pathname.startsWith("/student");
  
  // Protected teacher routes - require teacher role
  const isTeacherRoute = pathname.startsWith("/teacher");

  const isProtectedRoute = isStudentRoute || isTeacherRoute;

  // Redirect unauthenticated users from protected routes to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access control
  if (token && isProtectedRoute) {
    const userRole = token.role;

    // Student-only routes
    if (isStudentRoute && userRole !== "student") {
      const dashboardRoute = userRole === "teacher" ? "/teacher/dashboard" : "/login";
      return NextResponse.redirect(new URL(dashboardRoute, request.url));
    }

    // Teacher-only routes
    if (isTeacherRoute && userRole !== "teacher") {
      const dashboardRoute = userRole === "student" ? "/student/dashboard" : "/login";
      return NextResponse.redirect(new URL(dashboardRoute, request.url));
    }
  }

  // Redirect authenticated users from auth pages to appropriate dashboard
  if (
    token &&
    (pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/verify"))
  ) {
    const dashboardRoute = token.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard";
    return NextResponse.redirect(new URL(dashboardRoute, request.url));
  }

  // Redirect authenticated users from home page to appropriate dashboard
  if (token && pathname === "/") {
    const dashboardRoute = token.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard";
    return NextResponse.redirect(new URL(dashboardRoute, request.url));
  }

  return NextResponse.next();
}
