'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  Mail,
  BookOpen,
  TrendingUp,
  FileText,
  Calendar,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatDateTime } from '@/shared/utils/formatters';

export function ClassroomStudentsClient({ classroom, students = [] }) {
  const router = useRouter();
  const [expandedStudent, setExpandedStudent] = useState(null);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallStats = {
    totalStudents: students.length,
    totalTests: students.reduce((sum, s) => sum + s.totalTests, 0),
    averageScore: students.length > 0
      ? students.reduce((sum, s) => sum + s.averageScore, 0) / students.length
      : 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/teacher/classroom/${classroom?.id}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Classroom
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {classroom?.name || 'Classroom Students'}
            </h1>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="font-mono text-sm">
                {classroom?.code}
              </Badge>
              {classroom?.subjectName && (
                <Badge variant="secondary" className="text-sm">
                  {classroom.subjectName}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalTests}</div>
              <p className="text-xs text-muted-foreground">Tests completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(overallStats.averageScore)}`}>
                {overallStats.averageScore.toFixed(1)}/10
              </div>
              <p className="text-xs text-muted-foreground">Class average</p>
            </CardContent>
          </Card>
        </div>

        {/* Students List */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Students</h2>
        </div>

        {students.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No students yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Invite students to join this classroom to see their progress here.
                </p>
                <Link href={`/teacher/classroom/${classroom?.id}`}>
                  <Button variant="gradient">
                    Invite Students
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {students.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{student.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Mail className="h-3 w-3" />
                            {student.email}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(student.averageScore)}`}>
                        {student.averageScore.toFixed(1)}/10
                      </div>
                      <p className="text-xs text-gray-500">Average Score</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-semibold">{student.totalTests}</div>
                        <div className="text-xs text-gray-500">Total Tests</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="text-sm font-semibold">{student.testsByDifficulty.easy}</div>
                        <div className="text-xs text-gray-500">Easy</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="text-sm font-semibold">{student.testsByDifficulty.medium}</div>
                        <div className="text-xs text-gray-500">Medium</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="text-sm font-semibold">{student.testsByDifficulty.hard}</div>
                        <div className="text-xs text-gray-500">Hard</div>
                      </div>
                    </div>
                  </div>

                  {student.allTests.length > 0 && (
                    <Accordion type="single" collapsible>
                      <AccordionItem value={`student-${student.id}`}>
                        <AccordionTrigger className="text-sm font-medium">
                          View All Test Results ({student.allTests.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 mt-4">
                            {student.allTests.map((test) => (
                              <div
                                key={test.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <BookOpen className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-sm">
                                      {test.chapterName}
                                    </span>
                                    {test.topicName && (
                                      <>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-sm text-gray-600">
                                          {test.topicName}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3" />
                                    {formatDateTime(test.createdAt)}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge
                                    variant="outline"
                                    className={getDifficultyColor(test.difficultyLevel)}
                                  >
                                    {test.difficultyLevel}
                                  </Badge>
                                  <div className={`text-lg font-bold ${getScoreColor(test.testScore)}`}>
                                    {test.testScore}/10
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                  {student.allTests.length === 0 && (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No tests completed yet
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

