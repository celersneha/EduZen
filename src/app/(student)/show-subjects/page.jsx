"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Plus,
  ArrowRight,
  FileText,
  Calendar,
  Layers,
  Brain,
  CheckCircle,
  Target,
} from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 -left-24 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-4 py-16 max-w-7xl relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Learning{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Subjects
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your academic subjects and track your learning progress
            across all topics
          </p>

          {/* Quick Stats */}
          {subjects.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {subjects.length} Subject
                  {subjects.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">AI-Organized</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <Target className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Test Ready</span>
              </div>
            </div>
          )}
        </motion.div>

        {subjects.length === 0 ? (
          // Empty State with Modern Design
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden text-center">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12">
                <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold mb-2">
                  Welcome to EduZen!
                </CardTitle>
                <p className="text-blue-100 text-lg">
                  You haven't added any subjects yet
                </p>
              </CardHeader>

              <CardContent className="p-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Ready to start your learning journey?
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Upload your first syllabus and let our AI organize it into
                    structured chapters and topics. You'll be ready to take
                    tests and track your progress in minutes!
                  </p>

                  {/* Feature highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Upload PDF
                      </h4>
                      <p className="text-sm text-gray-600">
                        Simply upload your syllabus PDF file
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Brain className="h-8 w-8 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        AI Processing
                      </h4>
                      <p className="text-sm text-gray-600">
                        Our AI extracts and organizes content
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Target className="h-8 w-8 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Start Learning
                      </h4>
                      <p className="text-sm text-gray-600">
                        Take tests and track your progress
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-8">
                <Button
                  onClick={handleAddSubjectClick}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="mr-3 h-5 w-5" />
                  Add Your First Subject
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          // Subjects Grid with Modern Cards
          <div className="space-y-8">
            {/* Add Subject Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <Button
                onClick={handleAddSubjectClick}
                className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Subject
              </Button>
            </motion.div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card
                    className="bg-white/95 backdrop-blur-sm shadow-lg border-0 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 h-full"
                    onClick={() => handleSubjectClick(subject._id)}
                  >
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-white/20 text-white border-white/30"
                          >
                            Active
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-bold text-white mb-2 line-clamp-2">
                          {subject.subjectName}
                        </CardTitle>
                        <p className="text-white/80 text-sm line-clamp-2">
                          {subject.syllabusDescription ||
                            subject.description ||
                            "AI-organized syllabus ready for learning"}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Subject Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-xl">
                            <div className="flex items-center justify-center mb-1">
                              <Layers className="h-4 w-4 text-blue-600 mr-1" />
                              <span className="text-lg font-bold text-blue-600">
                                {subject.chapters?.length || 0}
                              </span>
                            </div>
                            <p className="text-xs text-blue-700">Chapters</p>
                          </div>

                          <div className="text-center p-3 bg-purple-50 rounded-xl">
                            <div className="flex items-center justify-center mb-1">
                              <Target className="h-4 w-4 text-purple-600 mr-1" />
                              <span className="text-lg font-bold text-purple-600">
                                {subject.chapters?.reduce(
                                  (total, chapter) =>
                                    total + (chapter.topics?.length || 0),
                                  0
                                ) || 0}
                              </span>
                            </div>
                            <p className="text-xs text-purple-700">Topics</p>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="text-xs">
                              {new Date(subject.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                            <span className="text-sm font-medium mr-1">
                              Open
                            </span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add animations */}
      <style jsx>{`
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
