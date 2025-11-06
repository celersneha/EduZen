"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export function ClassroomSubjectsClient({ classroomId, subjects }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Subjects in this Classroom
        </h1>
        {subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-gray-500 mb-2">
              No subjects found for this classroom.
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              onClick={() =>
                router.push(`/classroom/${classroomId}/add-subject`)
              }
            >
              Add Subject
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card
                key={subject.id || subject._id}
                className="bg-white/95 shadow border-0 rounded-xl"
              >
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl">
                  <CardTitle className="text-lg font-bold">
                    {subject.subjectName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-800">Syllabus:</span>
                    {subject.chapterCount > 0 ? (
                      <span className="text-green-600">Uploaded</span>
                    ) : (
                      <span className="text-yellow-600">Not uploaded</span>
                    )}
                  </div>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full"
                    onClick={() =>
                      router.push(
                        `/classroom/${classroomId}/${subject.id || subject._id}`
                      )
                    }
                  >
                    View Subject Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
