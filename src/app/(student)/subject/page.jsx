"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  FileText,
  BarChart3,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Target,
  Layers,
  Brain,
  Clock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function SubjectPage() {
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [showTestSection, setShowTestSection] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
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
    setShowSyllabus(true);
  };

  const handleAttemptTest = () => {
    toast.info("Test functionality coming soon!");
    // This will be implemented later
  };

  const handleStartTest = () => {
    if (!selectedChapter || !selectedTopic) {
      toast.error("Please select both chapter and topic to start the test");
      return;
    }

    // Navigate to test page with selected chapter, topic, and difficulty
    router.push(`/attempt-test?subjectID=${subjectID}&chapter=${encodeURIComponent(selectedChapter)}&topic=${encodeURIComponent(selectedTopic)}&difficulty=${selectedDifficulty}`);
  };

  const handleShowDashboard = () => {
    toast.info("Dashboard functionality coming soon!");
    // This will be implemented later
  };

  const toggleSyllabus = () => {
    setShowSyllabus(!showSyllabus);
  };

  const toggleTestSection = () => {
    setShowTestSection(!showTestSection);
    if (!showTestSection) {
      // Reset selections when opening
      setSelectedChapter("");
      setSelectedTopic("");
      setSelectedDifficulty("medium");
    }
  };

  const handleChapterChange = (chapterName) => {
    setSelectedChapter(chapterName);
    setSelectedTopic(""); // Reset topic when chapter changes
  };

  const getSelectedChapterTopics = () => {
    if (!selectedChapter || !subject?.chapters) return [];
    const chapter = subject.chapters.find(
      (ch) => ch.chapterName === selectedChapter
    );
    return chapter?.topics || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subject details...</p>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl p-8 text-center max-w-md">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Subject not found</h2>
            <p className="text-gray-600 mb-4">
              The subject you're looking for doesn't exist or you don't have access.
            </p>
            <Button onClick={() => router.push("/show-subjects")} className="w-full">
              Go back to subjects
            </Button>
          </CardContent>
        </Card>
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
          className="mb-12"
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/show-subjects")}
            className="mb-6 hover:bg-white/80 backdrop-blur-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subjects
          </Button>

          {/* Subject Header */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                {subject.subjectName}
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {subject.syllabusDescription || "Explore your subject content and test your knowledge"}
            </p>

            {/* Subject Stats */}
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <Layers className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {subject.chapters?.length || 0} Chapters
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <Target className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">
                  {subject.chapters?.reduce(
                    (total, chapter) => total + (chapter.topics?.length || 0),
                    0
                  ) || 0} Topics
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">AI-Organized</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Show Syllabus Card */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                onClick={toggleSyllabus}>
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-white mb-2">
                  {showSyllabus ? "Hide Syllabus" : "View Syllabus"}
                </CardTitle>
                <CardDescription className="text-blue-100">
                  {showSyllabus ? "Close syllabus view" : "Explore all chapters and topics"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600">
                {showSyllabus 
                  ? "Click to hide the complete syllabus content and return to the main view."
                  : "Access the complete syllabus content. Perfect for planning your study sessions and understanding the course structure."
                }
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button variant="outline" className="w-full group-hover:bg-blue-50 transition-colors">
                {showSyllabus ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Hide Syllabus
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Open Syllabus
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Attempt Test Card */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                onClick={toggleTestSection}>
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-white mb-2">
                  Take Tests
                </CardTitle>
                <CardDescription className="text-purple-100">
                  AI-generated practice tests
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600">
                Test your knowledge with personalized quizzes. Choose specific topics and difficulty levels.
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button variant="outline" className="w-full group-hover:bg-purple-50 transition-colors">
                Start Testing
              </Button>
            </CardFooter>
          </Card>

        
        </motion.div>

        {/* Expandable Test Section */}
        {showTestSection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold mb-2 flex items-center">
                      <Brain className="mr-3 h-6 w-6" />
                      AI Test Generator
                    </CardTitle>
                    <CardDescription className="text-purple-100 text-lg">
                      Create personalized tests based on your selected topics
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTestSection}
                    className="text-white hover:bg-white/20"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Test Configuration */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Configure Your Test
                    </h3>

                    {/* Chapter Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Layers className="mr-2 h-4 w-4" />
                        Select Chapter
                      </label>
                      <Select value={selectedChapter} onValueChange={handleChapterChange}>
                        <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg">
                          <SelectValue placeholder="Choose a chapter" />
                        </SelectTrigger>
                        <SelectContent>
                          {subject?.chapters?.map((chapter, index) => (
                            <SelectItem key={index} value={chapter.chapterName}>
                              {chapter.chapterName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Topic Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Target className="mr-2 h-4 w-4" />
                        Select Topic
                      </label>
                      <Select
                        value={selectedTopic}
                        onValueChange={setSelectedTopic}
                        disabled={!selectedChapter}
                      >
                        <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg">
                          <SelectValue placeholder="Choose a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {getSelectedChapterTopics().map((topic, index) => (
                            <SelectItem key={index} value={topic}>
                              {topic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Select Difficulty
                      </label>
                      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                        <SelectTrigger className="h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg">
                          <SelectValue placeholder="Choose difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                              <div>
                                <div className="font-medium">Easy</div>
                                <div className="text-xs text-gray-500">Basic concepts</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                              <div>
                                <div className="font-medium">Medium</div>
                                <div className="text-xs text-gray-500">Intermediate level</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="hard">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                              <div>
                                <div className="font-medium">Hard</div>
                                <div className="text-xs text-gray-500">Advanced concepts</div>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Test Preview */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Test Preview</h3>
                    
                    {selectedChapter && selectedTopic ? (
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">Test Configuration</h4>
                            <Badge variant="secondary" className={`
                              ${selectedDifficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                                selectedDifficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}
                            `}>
                              {selectedDifficulty}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Layers className="mr-2 h-4 w-4" />
                              <span className="font-medium">Chapter:</span>
                              <span className="ml-1">{selectedChapter}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Target className="mr-2 h-4 w-4" />
                              <span className="font-medium">Topic:</span>
                              <span className="ml-1">{selectedTopic}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="mr-2 h-4 w-4" />
                              <span className="font-medium">Duration:</span>
                              <span className="ml-1">10 minutes</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <Button
                            onClick={handleStartTest}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <PlayCircle className="mr-2 h-5 w-5" />
                            Start Test Now
                          </Button>
                          <p className="text-xs text-gray-500 mt-2">
                            AI will generate 10 questions for you
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <h4 className="font-medium text-gray-600 mb-2">Select Chapter & Topic</h4>
                        <p className="text-sm text-gray-500">
                          Choose a chapter and topic to see test preview
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Expandable Syllabus Section */}
        {showSyllabus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold mb-2 flex items-center">
                      <BookOpen className="mr-3 h-6 w-6" />
                      Complete Syllabus
                    </CardTitle>
                    <CardDescription className="text-blue-100 text-lg">
                      {subject.subjectName} - All chapters and topics
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSyllabus}
                    className="text-white hover:bg-white/20"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {subject.chapters?.map((chapter, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`chapter-${index}`}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <AccordionTrigger className="font-medium text-lg px-6 py-4 hover:bg-gray-50 no-underline">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                          </div>
                          {chapter.chapterName}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {chapter.topics?.map((topic, topicIndex) => (
                            <div
                              key={topicIndex}
                              className="flex items-center p-3 bg-white rounded-lg shadow-sm"
                            >
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                              <span className="text-sm text-gray-700">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
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
