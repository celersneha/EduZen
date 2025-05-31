"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function ShowSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const loadingToast = toast.loading("Loading your subjects...");
        const response = await fetch("/api/show-subjects");
        toast.dismiss(loadingToast);

        if (!response.ok) {
          throw new Error("Failed to fetch subjects");
        }
        const data = await response.json();
        console.log("Fetched subjects:", data);
        setSubjects(data.subjects || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Failed to load subjects");
        setLoading(false);
      }
    };

    if (session) {
      fetchSubjects();
    }
  }, [session]);

  const handleSubjectClick = (subjectId) => {
    router.push(`/subject?subjectID=${subjectId}`);
  };

  const handleAddSubjectClick = () => {
    router.push("/add-subject");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Subjects</h1>
        <Button onClick={handleAddSubjectClick}>Add New Subject</Button>
      </div>

      {subjects.length === 0 ? (
        <div className="bg-muted p-8 rounded-lg text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            You haven't added any subjects yet
          </h2>
          <p className="text-muted-foreground mb-4">
            Start by adding your first subject to manage your academic content
          </p>
          <Button onClick={handleAddSubjectClick}>Add New Subject</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map((subject) => (
            <Card
              key={subject._id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleSubjectClick(subject._id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{subject.subjectName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {subject.description
                    ? subject.description.substring(0, 60) + "..."
                    : "No description available"}
                </p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  {new Date(subject.createdAt).toLocaleDateString()}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
