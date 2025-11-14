"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  ChevronRight,
  Brain,
  Trophy,
  Target,
  ArrowLeft,
  BarChart3,
  BookOpen,
  Loader2,
} from "lucide-react";

function AttemptTestPageContent() {
  const [testStarted, setTestStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [explanations, setExplanations] = useState({});
  const [overallRemarks, setOverallRemarks] = useState([]);
  const [loadingExplanation, setLoadingExplanation] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const subjectID = searchParams.get("subjectID");
  const classroomId = searchParams.get("classroomId");
  const chapter = searchParams.get("chapter");
  const topic = searchParams.get("topic");
  const difficulty = searchParams.get("difficulty") || "medium";

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateScore = useCallback(() => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / questions.length) * 10);
  }, [questions, selectedAnswers]);

  const handleSubmitTest = useCallback(async () => {
    if (testCompleted) return; // Prevent multiple submissions
    
    const finalScore = calculateScore();
    setScore(finalScore);
    setTestCompleted(true);

    // Generate overall AI remarks
    try {
      const response = await fetch("/api/generate-remarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score: finalScore,
          totalQuestions: questions.length,
          topic: topic || null,
          chapter,
          difficulty,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOverallRemarks(data.remarks);
      }
    } catch (error) {
      console.error("Error generating remarks:", error);
    }

    // Save test result to database using Server Action
    try {
      const { saveTestResult } = await import('@/actions/test/save-test-result');
      const result = await saveTestResult({
        studentId: session?.user?.id,
        subjectId: subjectID,
        chapterName: chapter,
        topicName: topic || null,
        testScore: finalScore,
        difficultyLevel: difficulty,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Test completed and results saved!");
      }
    } catch (error) {
      console.error("Error saving test result:", error);
      toast.error("Test completed but failed to save results");
    }
  }, [testCompleted, calculateScore, questions.length, topic, chapter, difficulty, session?.user?.id, subjectID]);

  // Timer effect
  useEffect(() => {
    if (testStarted && !testCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time is about to expire, submit test
            setTimeout(() => {
              handleSubmitTest();
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, testCompleted, timeLeft, handleSubmitTest]);

  const handleStartTest = async () => {
    if (!session?.user) {
      toast.error("Please login to attempt the test");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectID,
          chapter,
          topic,
          difficulty: difficulty,
          questionCount: 10,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions");
      }

      const data = await response.json();
      setQuestions(data.questions);
      setTestStarted(true);
      toast.success("Test started! Good luck!");
    } catch (error) {
      console.error("Error starting test:", error);
      toast.error("Failed to start test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };


  const generateExplanation = async (questionIndex) => {
    if (explanations[questionIndex]) return; // Already generated

    setLoadingExplanation(questionIndex);
    try {
      const question = questions[questionIndex];
      const userAnswer = selectedAnswers[questionIndex];
      const correctAnswer = question.correctAnswer;

      const response = await fetch("/api/generate-explanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.question,
          options: question.options,
          userAnswer,
          correctAnswer,
          topic: topic || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setExplanations((prev) => ({
          ...prev,
          [questionIndex]: data.explanation,
        }));
      }
    } catch (error) {
      console.error("Error generating explanation:", error);
      toast.error("Failed to generate explanation");
    } finally {
      setLoadingExplanation(null);
    }
  };

  if (!subjectID || !chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Animated Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 -left-24 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-4 py-16 max-w-2xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-8">
                <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Invalid Test Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-600 mb-6">
                  Please select a valid chapter to attempt the test.
                </p>
                <Button
                  onClick={() => router.back()}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </motion.div>
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

  if (testCompleted && !showReview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Animated Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 -left-24 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-4 py-16 max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 text-center">
                <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold mb-2">
                  Test Completed!
                </CardTitle>
                <p className="text-green-100">
                  Congratulations on completing your test
                </p>
              </CardHeader>

              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-green-600 mb-4">
                    {score}/10
                  </div>
                  <p className="text-xl text-gray-700 mb-2">
                    You scored{" "}
                    <span className="font-bold text-green-600">{score}</span>{" "}
                    out of 10 in
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-sm">
                      {chapter}
                    </Badge>
                    {topic && (
                      <>
                        <span className="text-gray-400">→</span>
                        <Badge variant="outline" className="text-sm">
                          {topic}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                {/* Overall AI Remarks */}
                {overallRemarks.length > 0 && (
                  <div className="mb-8 p-6 bg-blue-50 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">
                        AI Analysis & Insights
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {overallRemarks.map((remark, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-700 text-sm">
                            {remark}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Score Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-green-50 rounded-2xl text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold text-green-700 mb-1">
                      Correct Answers
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {Math.round((score / 10) * questions.length)}
                    </p>
                    <p className="text-sm text-green-600">
                      out of {questions.length}
                    </p>
                  </div>

                  <div className="p-6 bg-red-50 rounded-2xl text-center">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold text-red-700 mb-1">
                      Incorrect Answers
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      {questions.length -
                        Math.round((score / 10) * questions.length)}
                    </p>
                    <p className="text-sm text-red-600">
                      out of {questions.length}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-8 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <Button
                    onClick={() => setShowReview(true)}
                    variant="outline"
                    className="h-12 rounded-xl"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Review Answers
                  </Button>
                  <Button
                    onClick={() =>
                      router.push(
                        `/student/subject?${classroomId ? `classroomId=${classroomId}` : `subjectID=${subjectID}`}`
                      )
                    }
                    className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Back to Subject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="h-12 rounded-xl"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Retake Test
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
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

  if (testCompleted && showReview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Animated Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 -left-24 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-4 py-16 max-w-5xl relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Test Review:{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                {topic || chapter}
              </span>
            </h1>
            <div className="flex items-center justify-center gap-4 text-gray-600">
              <span>Score: {score}/10</span>
              <span>•</span>
              <span>{questions.length} Questions</span>
              <span>•</span>
              <Badge variant="secondary">{difficulty}</Badge>
            </div>
            <Button
              onClick={() => setShowReview(false)}
              variant="outline"
              className="mt-4 rounded-xl"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Results
            </Button>
          </motion.div>

          {/* Questions Review */}
          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`bg-white/95 backdrop-blur-sm shadow-lg border-0 rounded-2xl overflow-hidden border-l-4 ${
                      isCorrect ? "border-l-green-500" : "border-l-red-500"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-gray-900">
                          Q{index + 1}. {question.question}
                        </CardTitle>
                        <Badge
                          className={`${
                            isCorrect
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid gap-3">
                        {question.options.map((option, optionIndex) => {
                          const isUserChoice = userAnswer === optionIndex;
                          const isCorrectOption =
                            question.correctAnswer === optionIndex;

                          return (
                            <div
                              key={optionIndex}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                isCorrectOption
                                  ? "border-green-500 bg-green-50"
                                  : isUserChoice && !isCorrect
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-900">{option}</span>
                                <div className="flex items-center space-x-2">
                                  {isCorrectOption && (
                                    <Badge className="bg-green-100 text-green-700 border-green-200">
                                      ✓ Correct Answer
                                    </Badge>
                                  )}
                                  {isUserChoice && !isCorrect && (
                                    <Badge className="bg-red-100 text-red-700 border-red-200">
                                      ✗ Your Choice
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation Section */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-600" />
                            AI Explanation
                          </h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateExplanation(index)}
                            disabled={loadingExplanation === index}
                            className="rounded-lg"
                          >
                            {loadingExplanation === index ? (
                              <>
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
                                Loading...
                              </>
                            ) : explanations[index] ? (
                              "Refresh Explanation"
                            ) : (
                              "Get Explanation"
                            )}
                          </Button>
                        </div>

                        {explanations[index] && (
                          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                            <p className="text-purple-800 leading-relaxed">
                              {explanations[index]}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <Button
              onClick={() =>
                router.push(
                  `/student/subject?${classroomId ? `classroomId=${classroomId}` : `subjectID=${subjectID}`}`
                )
              }
              className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Back to Subject
            </Button>
          </motion.div>
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

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Animated Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 -left-24 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-4 py-16 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ready to Take Your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Test?
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Test your knowledge and track your learning progress
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    Test Instructions
                  </CardTitle>
                </div>
                <p className="text-blue-100 text-center">
                  Please read the instructions carefully before starting
                </p>
              </CardHeader>

              <CardContent className="p-8">
                {/* Test Details */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl mb-8">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">
                    📋 Test Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Chapter:</span>
                        <Badge variant="secondary">{chapter}</Badge>
                      </div>
                      {topic ? (
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">Topic:</span>
                          <Badge variant="outline">{topic}</Badge>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">Scope:</span>
                          <Badge variant="outline">Entire Chapter</Badge>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Questions:</span>
                        <span className="font-bold">10</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">Time Limit:</span>
                        <span className="font-bold">10 minutes</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="font-medium">Difficulty:</span>
                    <Badge
                      className={`${
                        difficulty === "easy"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </Badge>
                  </div>
                </div>

                {/* Instructions */}
                <Alert className="border-blue-200 bg-blue-50 mb-6">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-900">
                        📖 Important Instructions:
                      </h4>
                      <ul className="space-y-2 text-blue-800">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          Read each question carefully before selecting an
                          answer
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          You can navigate between questions using Next/Previous
                          buttons
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          Make sure to answer all questions before time runs out
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          Your test will be auto-submitted when time expires
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          You can submit the test early if you&apos;re done
                        </li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Connection Check */}
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertDescription className="text-green-800">
                    ✅ Make sure you have a stable internet connection before
                    starting the test.
                  </AlertDescription>
                </Alert>
              </CardContent>

              <CardFooter className="p-8 bg-gray-50">
                <Button
                  onClick={handleStartTest}
                  disabled={loading}
                  className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-3 h-6 w-6" />
                      Start Test Now
                      <ChevronRight className="ml-3 h-6 w-6" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
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

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 -left-24 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        {/* Header with timer and progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test:{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {topic || chapter}
            </span>
          </h1>
          <div className="flex items-center justify-center gap-6 text-gray-600">
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span
                className={`font-mono text-lg font-bold ${
                  timeLeft < 120 ? "text-red-500" : "text-orange-500"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          className="w-full bg-gray-200 rounded-full h-3 mb-8 overflow-hidden"
        >
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          ></div>
        </motion.div>

        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          key={currentQuestionIndex}
        >
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <CardTitle className="text-xl">
                Q{currentQuestionIndex + 1}. {currentQuestion?.question}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <div className="space-y-4">
                {currentQuestion?.options?.map((option, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                    onClick={() =>
                      handleAnswerSelect(currentQuestionIndex, index)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 transition-all ${
                          selectedAnswers[currentQuestionIndex] === index
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAnswers[currentQuestionIndex] === index && (
                          <div className="w-3 h-3 bg-white rounded-full mx-auto mt-0.5"></div>
                        )}
                      </div>
                      <span className="text-gray-900 font-medium">
                        {option}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between p-6 bg-gray-50">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="rounded-xl"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <div className="flex space-x-3">
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitTest}
                    className="bg-green-600 hover:bg-green-700 rounded-xl px-8"
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Submit Test
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Question navigator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Question Navigator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                {questions.map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      index === currentQuestionIndex
                        ? "bg-blue-600 text-white shadow-lg"
                        : selectedAnswers[index] !== undefined
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
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

export default function AttemptTestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <AttemptTestPageContent />
    </Suspense>
  );
}
