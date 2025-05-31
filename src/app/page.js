"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  BrainCircuit,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-white -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 -left-24 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                The Ultimate
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  {" "}
                  AI{" "}
                </span>
                Your Learning Assistance
              </h1>
              <p className="text-lg text-gray-600 md:pr-8">
                EduZen leverages AI to help you master your subjects, track
                progress, and ace your tests. Upload your syllabus and let our
                AI generate personalized quizzes in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 px-8 rounded-lg text-lg w-full sm:w-auto">
                    Get started for free
                    <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    variant="outline"
                    className="py-6 px-8 rounded-lg text-lg w-full sm:w-auto"
                  >
                    See how it works
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span>AI-powered</span>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 relative">
              <div className="bg-white rounded-2xl shadow-xl p-2 md:p-4 border border-gray-100">
                <div className="relative aspect-[5/3] rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                  <div className="absolute inset-0 opacity-20 bg-[url('/grid-pattern.svg')]"></div>

                  {/* AI Syllabus Processing Card */}
                  <div className="absolute right-4 top-6 bg-white rounded-2xl shadow-lg p-4 w-64">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          AI Syllabus Analyzer
                        </p>
                        <p className="text-xs text-gray-500">
                          Processing PDF...
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-green-800">
                        ✓ 12 chapters extracted
                      </p>
                      <p className="text-xs text-green-800">
                        ✓ 45 topics organized
                      </p>
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-gray-400">Just now</span>
                      </div>
                    </div>
                  </div>

                  {/* Test Generation Card */}
                  <div className="absolute right-24 bottom-8 bg-white rounded-2xl shadow-lg p-4 w-72">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <BrainCircuit className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-sm font-medium">AI Test Generator</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-purple-600 text-white text-xs px-3"
                      >
                        Generate
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600">
                      Chapter: Data Structures • Difficulty: Medium
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs text-purple-600">Q</span>
                        </div>
                        <span className="text-xs">10 questions ready</span>
                      </div>
                      <span className="text-xs text-purple-600 underline">
                        Start Test →
                      </span>
                    </div>
                  </div>

                  {/* Performance Analytics Icons */}
                  <div className="absolute left-4 bottom-16 flex items-end">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center z-10">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center -ml-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-yellow-600"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                  </div>

                  {/* AI Insights Badge */}
                  <div className="absolute left-4 top-8 bg-white/90 backdrop-blur rounded-lg px-3 py-2">
                    <p className="text-xs font-medium text-gray-800">
                      🤖 AI-Powered Learning
                    </p>
                  </div>
                </div>

                <div className="mt-4 px-2">
                  <p className="text-center font-medium">
                    85% improvement in test scores!
                  </p>
                  <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full">
                    <div
                      className="h-1.5 bg-gradient-to-r from-green-500 to-blue-600 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Supercharge Your Learning Journey
            </h2>
            <p className="text-gray-600">
              EduZen provides powerful tools to help you organize your study
              material, test your knowledge, and track your progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Smart Syllabus Management
              </h3>
              <p className="text-gray-600">
                Upload your syllabus PDFs and our AI will automatically extract
                and organize chapters and topics for you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BrainCircuit className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Test Generation</h3>
              <p className="text-gray-600">
                Generate custom tests at subject, chapter, or topic level with
                adjustable difficulty levels.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Performance Analytics
              </h3>
              <p className="text-gray-600">
                Track your progress with detailed analytics and get personalized
                insights to improve your learning.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-yellow-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Feedback</h3>
              <p className="text-gray-600">
                Get immediate explanations for right and wrong answers to
                enhance your understanding.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-red-600"
                >
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 2 17.5v-15a2.5 2.5 0 0 1 4.96-.44A2.5 2.5 0 0 1 12 4.5" />
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44A2.5 2.5 0 0 0 22 17.5v-15a2.5 2.5 0 0 0-4.96-.44A2.5 2.5 0 0 0 12 4.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Personalized Learning
              </h3>
              <p className="text-gray-600">
                Our AI adapts to your learning style and focuses on areas where
                you need more practice.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your learning data is securely stored and your privacy is always
                protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How EduZen Works
            </h2>
            <p className="text-gray-600">
              Get started in minutes and transform your learning experience
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <Image
                src="/mockup-placeholder.png"
                width={600}
                height={400}
                alt="EduZen dashboard mockup"
                className="rounded-xl shadow-lg border border-gray-200"
                priority
              />
            </div>

            <div className="md:w-1/2 space-y-8">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Upload Your Syllabus
                  </h3>
                  <p className="text-gray-600">
                    Simply upload your PDF syllabus and our AI will
                    automatically extract all chapters and topics.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Generate Custom Tests
                  </h3>
                  <p className="text-gray-600">
                    Choose any chapter or topic and select a difficulty level to
                    generate a personalized test.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Practice and Improve
                  </h3>
                  <p className="text-gray-600">
                    Answer questions, get instant feedback, and see detailed
                    explanations for each answer.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-600">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Track Your Progress
                  </h3>
                  <p className="text-gray-600">
                    Monitor your performance over time with analytics and get AI
                    insights to improve your studying.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
