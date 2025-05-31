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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  ChevronRight,
} from "lucide-react";

export default function AttemptTestPage() {
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
  const chapter = searchParams.get("chapter");
  const topic = searchParams.get("topic");
  const difficulty = searchParams.get("difficulty") || "medium";

  // Timer effect
  useEffect(() => {
    if (testStarted && !testCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && testStarted) {
      handleSubmitTest();
    }
  }, [testStarted, testCompleted, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / questions.length) * 10);
  };

  const handleSubmitTest = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setTestCompleted(true);

    // Generate overall AI remarks
    await generateOverallRemarks(finalScore);

    // Save test result to database
    try {
      await fetch("/api/save-test-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: session.user.id,
          subjectId: subjectID,
          chapterName: chapter,
          topicName: topic,
          testScore: finalScore,
          difficultyLevel: difficulty,
        }),
      });
      toast.success("Test completed and results saved!");
    } catch (error) {
      console.error("Error saving test result:", error);
      toast.error("Test completed but failed to save results");
    }
  };

  const generateOverallRemarks = async (score) => {
    try {
      const response = await fetch("/api/generate-remarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score,
          totalQuestions: questions.length,
          topic,
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
          topic,
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

  if (!subjectID || !chapter || !topic) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-xl font-semibold">Invalid Test Parameters</h2>
        <p className="mt-2 text-muted-foreground">
          Please select a valid chapter and topic to attempt the test.
        </p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  if (testCompleted && !showReview) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">
              Test Completed!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-6xl font-bold text-green-600">{score}/10</div>
            <p className="text-lg">
              You scored {score} out of 10 in <strong>{topic}</strong>
            </p>

            {/* Overall AI Remarks */}
            {overallRemarks.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
                <h3 className="font-semibold text-blue-800 mb-2">AI Analysis</h3>
                <ul className="space-y-1 text-sm text-blue-700">
                  {overallRemarks.map((remark, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{remark}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="font-semibold text-green-700">Correct</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((score / 10) * questions.length)}
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="font-semibold text-red-700">Incorrect</p>
                <p className="text-2xl font-bold text-red-600">
                  {questions.length - Math.round((score / 10) * questions.length)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 justify-center">
            <Button onClick={() => setShowReview(true)} variant="outline">
              Review Answers
            </Button>
            <Button onClick={() => router.push(`/subject?subjectID=${subjectID}`)}>
              Back to Subject
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retake Test
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (testCompleted && showReview) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Test Review: {topic}</h1>
            <p className="text-muted-foreground">
              Score: {score}/10 • {questions.length} Questions
            </p>
          </div>
          <Button onClick={() => setShowReview(false)} variant="outline">
            Back to Results
          </Button>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <Card
                key={index}
                className={`border-l-4 ${
                  isCorrect ? "border-l-green-500" : "border-l-red-500"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      Q{index + 1}. {question.question}
                    </CardTitle>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isCorrect
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    {question.options.map((option, optionIndex) => {
                      const isUserChoice = userAnswer === optionIndex;
                      const isCorrectOption = question.correctAnswer === optionIndex;

                      return (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border ${
                            isCorrectOption
                              ? "border-green-500 bg-green-50"
                              : isUserChoice && !isCorrect
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            <div className="flex items-center space-x-2">
                              {isCorrectOption && (
                                <span className="text-green-600 text-sm font-medium">
                                  ✓ Correct
                                </span>
                              )}
                              {isUserChoice && !isCorrect && (
                                <span className="text-red-600 text-sm font-medium">
                                  ✗ Your choice
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Explanation</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateExplanation(index)}
                        disabled={loadingExplanation === index}
                      >
                        {loadingExplanation === index ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
                            Loading...
                          </>
                        ) : explanations[index] ? (
                          "Refresh Explanation"
                        ) : (
                          "Explain This"
                        )}
                      </Button>
                    </div>

                    {explanations[index] && (
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">
                        {explanations[index]}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => router.push(`/subject?subjectID=${subjectID}`)}>
            Back to Subject
          </Button>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-6 w-6" />
              Test Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Test Details</h3>
              <p>
                <strong>Chapter:</strong> {chapter}
              </p>
              <p>
                <strong>Topic:</strong> {topic}
              </p>
              <p>
                <strong>Questions:</strong> 10
              </p>
              <p>
                <strong>Time Limit:</strong> 10 minutes
              </p>
              <p>
                <strong>Difficulty:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs capitalize ${
                    difficulty === "easy"
                      ? "bg-green-100 text-green-800"
                      : difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {difficulty}
                </span>
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important Instructions:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Read each question carefully before selecting an answer</li>
                  <li>
                    You can navigate between questions using Next/Previous buttons
                  </li>
                  <li>Make sure to answer all questions before time runs out</li>
                  <li>Your test will be auto-submitted when time expires</li>
                  <li>You can submit the test early if you're done</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Alert className="border-green-500">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Make sure you have a stable internet connection before starting the
                test.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleStartTest}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Start Test
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header with timer and progress */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Test: {topic}</h1>
          <p className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-orange-500" />
            <span
              className={`font-mono text-lg ${
                timeLeft < 120 ? "text-red-500" : "text-orange-500"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            Q{currentQuestionIndex + 1}. {currentQuestion?.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion?.options?.map((option, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleAnswerSelect(currentQuestionIndex, index)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full border mr-3 ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <div className="flex space-x-2">
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmitTest}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Test
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Question navigator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Question Navigator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded text-sm font-medium ${
                  index === currentQuestionIndex
                    ? "bg-blue-600 text-white"
                    : selectedAnswers[index] !== undefined
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
