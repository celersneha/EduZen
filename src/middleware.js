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
    "/teacher/:path*",
    "/classroom/:path*",
    "/student/classroom/:path*",
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
  const protectedStudentRoutes = [
    "/add-subject",
    "/attempt-test",
    "/show-subjects",
    "/subject",
    "/syllabus",
    "/student/classroom",
  ];

  // Protected teacher routes - require teacher role
  const protectedTeacherRoutes = [
    "/teacher",
  ];

  // Classroom routes - role-based access
  const classroomRoutes = [
    "/classroom",
  ];

  // Check if current path is a protected route
  const isProtectedStudentRoute = protectedStudentRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isProtectedTeacherRoute = protectedTeacherRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isClassroomRoute = classroomRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isProtectedRoute = isProtectedStudentRoute || isProtectedTeacherRoute || isClassroomRoute;

  // Redirect unauthenticated users from protected routes to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access control
  if (token && isProtectedRoute) {
    const userRole = token.role;

    // Student-only routes
    if (isProtectedStudentRoute && userRole !== "student") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Teacher-only routes
    if (isProtectedTeacherRoute && userRole !== "teacher") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Classroom routes - allow both but redirect based on role
    // /classroom/join is accessible to students
    // /classroom/* (management) is for teachers
    if (isClassroomRoute) {
      if (pathname.startsWith("/classroom/join") && userRole !== "student") {
        // Students can access join, but teachers can too (for viewing)
        // Allow for now, can be restricted later
      } else if (
        pathname.startsWith("/classroom/create") ||
        pathname.startsWith("/classroom/upload") ||
        pathname.startsWith("/classroom/invite")
      ) {
        if (userRole !== "teacher") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    }
  }

  // Redirect authenticated users from auth pages to appropriate dashboard
  if (
    token &&
    (pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/verify"))
  ) {
    const dashboardRoute =
      token.role === "teacher" ? "/teacher/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(dashboardRoute, request.url));
  }

  // Redirect authenticated users from home page to appropriate dashboard
  if (token && pathname === "/") {
    const dashboardRoute =
      token.role === "teacher" ? "/teacher/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(dashboardRoute, request.url));
  }

  return NextResponse.next();
}
