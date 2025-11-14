"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Plus, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function StudentClassroomsClient({ classrooms, error }) {
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Classrooms
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Classrooms
            </h1>
            <p className="text-gray-600">View all classrooms you&apos;ve joined</p>
          </div>
          <Link href="/student/student-classroom/join">
            <Button variant="gradient">
              <Plus className="mr-2 h-4 w-4" />
              Join Classroom
            </Button>
          </Link>
        </div>

        {classrooms.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No classrooms yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Join a classroom using the code provided by your teacher
                </p>
                <Link href="/student/student-classroom/join">
                  <Button variant="gradient">
                    <Plus className="mr-2 h-4 w-4" />
                    Join Your First Classroom
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map((classroom) => (
              <Card
                key={classroom.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-xl mb-2">
                    {classroom.classroomName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {classroom.classroomCode}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Link href={`/student-classroom/${classroom.id}`}>
                      <Button className="w-full" variant="outline">
                        View Classroom
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
