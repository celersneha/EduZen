"use client";

import Link from "next/link";
import {
  BookOpen,
  Users,
  Plus,
  FileText,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TeacherDashboardClient({ classrooms, error, userName }) {
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600">
            Manage your classrooms and track student progress
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Classrooms
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classrooms.length}</div>
              <p className="text-xs text-muted-foreground">Active classrooms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {classrooms.reduce((sum, c) => sum + (c.studentCount || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all classrooms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Syllabus Uploaded
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {classrooms.filter((c) => c.hasSyllabus).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Classrooms with syllabus
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Create Classroom CTA - Only show when no classrooms exist */}
        {classrooms.length === 0 && (
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Create Your First Classroom
                </h3>
                <p className="text-blue-100">
                  Start by creating a classroom and inviting your students
                </p>
              </div>
              <Link href="/teacher/classroom/create">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Classroom
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Classrooms List */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">My Classrooms</h2>
          <Link href="/teacher/classroom/create">
            <Button variant="gradient">
              <Plus className="mr-2 h-4 w-4" />
              New Classroom
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
                  Create your first classroom to start managing your students
                </p>
                <Link href="/teacher/classroom/create">
                  <Button variant="gradient">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Classroom
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
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {classroom.classroomName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {classroom.classroomCode}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Students
                      </span>
                      <span className="font-semibold">
                        {classroom.studentCount || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        Syllabus
                      </span>
                      {classroom.hasSyllabus ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700"
                        >
                          {classroom.syllabusName}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-500"
                        >
                          Not uploaded
                        </Badge>
                      )}
                    </div>

                    <Link href={`/teacher/classroom/${classroom.id}`}>
                      <Button className="w-full" variant="outline">
                        Manage Classroom
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
