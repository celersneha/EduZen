"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="container mx-auto p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg p-2">
          <span className="text-xl">EduZen</span>
        </div>
      </div>
      <div className="hidden md:flex space-x-6 items-center">
        <Link href="#features" className="text-gray-600 hover:text-gray-900">
          Features
        </Link>
        <Link
          href="#how-it-works"
          className="text-gray-600 hover:text-gray-900"
        >
          How it works
        </Link>

        <Link href="/register">
          <Button variant="outline" className="ml-4">
            Sign Up
          </Button>
        </Link>
        <Link href="/login">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Login
          </Button>
        </Link>
      </div>
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
