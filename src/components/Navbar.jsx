"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, BookOpen, BarChart3 } from "lucide-react";
import { NotificationBell } from "@/components/notification-bell";

export function Navbar() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="container mx-auto p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link
          href={
            session
              ? session.user?.role === "teacher"
                ? "/teacher/dashboard"
                : "/dashboard"
              : "/"
          }
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg p-2 cursor-pointer hover:shadow-lg transition-shadow">
            <span className="text-xl">EduZen</span>
          </div>
        </Link>
      </div>

      {session ? (
        // Logged in user navigation
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            href={
              session.user?.role === "teacher"
                ? "/teacher/dashboard"
                : "/dashboard"
            }
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Dashboard
          </Link>
          {session.user?.role === "teacher" ? (
            <>
              <Link
                href="/classroom/create"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Create Classroom
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/classroom/list"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                My Classrooms
              </Link>
              <Link
                href="/show-subjects"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                My Subjects
              </Link>
            </>
          )}

          {/* Notification Bell */}
          <NotificationBell />

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={session.user?.image}
                    alt={session.user?.username || "User"}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    {session.user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{session.user?.username}</p>
                  <p className="w-48 truncate text-sm text-muted-foreground">
                    {session.user?.email}
                  </p>
                  {session.user?.role && (
                    <p className="text-xs text-muted-foreground capitalize">
                      {session.user.role}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={
                    session.user?.role === "teacher"
                      ? "/teacher/dashboard"
                      : "/dashboard"
                  }
                  className="cursor-pointer"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              {session.user?.role === "teacher" ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/classroom/create" className="cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Create Classroom
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/classroom/list" className="cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      My Classrooms
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/show-subjects" className="cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      My Subjects
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        // Logged out user navigation
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            href="#features"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            How it works
          </Link>
          <Link href="/register">
            <Button variant="outline" className="ml-4 rounded-lg">
              Sign Up
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg">
              Login
            </Button>
          </Link>
        </div>
      )}

      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </Button>
    </nav>
  );
}
