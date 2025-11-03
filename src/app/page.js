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
                The Future of
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  {" "}
                  Smart{" "}
                </span>
                Classroom Management
              </h1>

              <p className="text-lg text-gray-600 md:pr-8">
                EduZen streamlines classrooms with AI—manage attendance,
                resources, and safety. Track progress, get insights, and enhance
                learning with real-time analytics.
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
              <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 backdrop-blur-sm">
                <div className="relative grid grid-cols-2 gap-4">
                  {/* Attendance Automation Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-4 transform hover:scale-105 transition-transform">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="text-white"
                      >
                        <path
                          fill="currentColor"
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-blue-800 mb-1">
                      Attendance Automation
                    </h3>
                    <p className="text-xs text-blue-600">
                      Facial recognition & real-time tracking
                    </p>
                    <div className="mt-2 flex items-center text-xs text-blue-500">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                      <span>Active</span>
                    </div>
                  </div>

                  {/* Resource Management Card */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-4 transform hover:scale-105 transition-transform">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-white"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M7 15h10M7 11h6" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-green-800 mb-1">
                      Resource Management
                    </h3>
                    <p className="text-xs text-green-600">
                      Smart scheduling & maintenance
                    </p>
                    <div className="mt-2 text-xs text-green-500">
                      <span>95% efficiency</span>
                    </div>
                  </div>

                  {/* Safety & Security Card */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg p-4 transform hover:scale-105 transition-transform">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-white"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-red-800 mb-1">
                      Safety & Security
                    </h3>
                    <p className="text-xs text-red-600">
                      Real-time alerts & monitoring
                    </p>
                    <div className="mt-2 flex items-center text-xs text-red-500">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                      <span>Secure</span>
                    </div>
                  </div>

                  {/* Interactive Learning Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-4 transform hover:scale-105 transition-transform">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-white"
                      >
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-purple-800 mb-1">
                      Interactive Learning
                    </h3>
                    <p className="text-xs text-purple-600">
                      Smart boards & AI analytics
                    </p>
                    <div className="mt-2 text-xs text-purple-500">
                      <span>85% engagement</span>
                    </div>
                  </div>
                </div>

                {/* Central AI Hub Indicator */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-white"
                  >
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
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
                src="/dashboard.jpg"
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
