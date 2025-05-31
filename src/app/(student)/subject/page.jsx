"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, BarChart3 } from "lucide-react";

export default function SubjectPage() {
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const subjectID = searchParams.get("subjectID");

  useEffect(() => {
    const fetchSubject = async () => {
      if (!subjectID) {
        toast.error("Subject ID is missing");
        router.push("/show-subjects");
        return;
      }

      try {
        const loadingToast = toast.loading("Loading subject details...");
        const response = await fetch(
          `/api/get-syllabus?subjectID=${subjectID}`
        );
        toast.dismiss(loadingToast);

        if (!response.ok) {
          throw new Error("Failed to fetch subject details");
        }

        const data = await response.json();
        setSubject(data);
      } catch (error) {
        console.error("Error fetching subject:", error);
        toast.error("Failed to load subject details");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchSubject();
    }
  }, [session, subjectID, router]);

  const handleShowSyllabus = () => {
    router.push(`/syllabus-details?subjectID=${subjectID}`);
  };

  const handleAttemptTest = () => {
    toast.info("Test functionality coming soon!");
    // This will be implemented later
  };

  const handleShowDashboard = () => {
    toast.info("Dashboard functionality coming soon!");
    // This will be implemented later
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-xl font-semibold">Subject not found</h2>
        <p className="mt-2 text-muted-foreground">
          The subject you're looking for doesn't exist or you don't have access.
        </p>
        <Button onClick={() => router.push("/show-subjects")} className="mt-4">
          Go back to subjects
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{subject.syllabusSubject}</h1>
        <p className="text-muted-foreground mt-2">
          {subject.syllabusDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Show Syllabus Card */}
        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" /> Syllabus
            </CardTitle>
            <CardDescription>
              View the complete syllabus content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Access all chapters and topics in your syllabus. Great for
              planning your study sessions.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleShowSyllabus}>
              View Syllabus
            </Button>
          </CardFooter>
        </Card>

        {/* Attempt Test Card */}
        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" /> Tests
            </CardTitle>
            <CardDescription>Test your knowledge with quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Take practice tests to evaluate your understanding of the subject
              material.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleAttemptTest}
              variant="outline"
            >
              Attempt Test
            </Button>
          </CardFooter>
        </Card>

        {/* Show Dashboard Card */}
        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" /> Dashboard
            </CardTitle>
            <CardDescription>Track your learning progress</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              View analytics and insights about your performance and study
              habits.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleShowDashboard}
              variant="outline"
            >
              View Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
