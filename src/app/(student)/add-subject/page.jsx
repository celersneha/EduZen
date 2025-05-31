"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload,
  FileText,
  BookOpen,
  BrainCircuit,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function AddSubject() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        setFile(null);
        setFileName("");
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("You must be logged in to upload a syllabus");
      return;
    }

    if (!file) {
      toast.error("Please select a PDF file to upload");
      return;
    }

    if (!subjectName.trim()) {
      toast.error("Please enter a subject name");
      return;
    }

    setIsUploading(true);

    // Show processing toast
    const uploadingToast = toast.loading("Processing your syllabus...");

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("subjectName", subjectName.trim());

      const response = await fetch("/api/add-subject", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process syllabus");
      }

      // Dismiss loading toast and show success
      toast.dismiss(uploadingToast);
      toast.success("Syllabus uploaded successfully!");

      // Reset form
      setFile(null);
      setFileName("");
      setSubjectName("");

      // Redirect after successful upload with a short delay
      setTimeout(() => {
        router.push("/show-subjects");
      }, 1000);
    } catch (err) {
      console.error("Error uploading syllabus:", err);
      // Dismiss loading toast and show error
      toast.dismiss(uploadingToast);
      toast.error(err.message || "Failed to upload syllabus");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 -left-24 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-4 py-16 max-w-6xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Add Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Subject
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your syllabus PDF and let our AI extract and organize all
            chapters and topics automatically
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">AI-Powered Extraction</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Instant Organization</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Ready for Tests</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Upload Form */}
          <div className="order-2 lg:order-1">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <BookOpen className="h-7 w-7" />
                  Upload Your Syllabus
                </CardTitle>
                <p className="text-blue-100">
                  Transform your PDF into organized study material
                </p>
              </CardHeader>

              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Subject Name Input */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="subjectName"
                      className="text-lg font-semibold text-gray-700"
                    >
                      Subject Name
                    </Label>
                    <Input
                      id="subjectName"
                      placeholder="e.g., Computer Science, Mathematics, Physics"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                      required
                    />
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold text-gray-700">
                      Syllabus PDF
                    </Label>

                    <div
                      className={`border-3 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                        fileName
                          ? "border-green-300 bg-green-50"
                          : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                      }`}
                    >
                      {!fileName ? (
                        <div className="text-center">
                          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                            <Upload className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Drop your PDF here
                          </h3>
                          <p className="text-gray-500 mb-4">
                            or click to browse files
                          </p>
                          <p className="text-sm text-gray-400">
                            Supports PDF files up to 10MB
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                            <FileText className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-green-700 mb-2">
                            File Selected!
                          </h3>
                          <p className="text-green-600 font-medium">
                            {fileName}
                          </p>
                          <p className="text-sm text-green-500 mt-2">
                            Ready to upload
                          </p>
                        </div>
                      )}

                      <Input
                        id="pdf"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    <label htmlFor="pdf" className="block w-full">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-14 text-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300"
                        asChild
                      >
                        <span className="cursor-pointer">
                          {fileName ? "Change File" : "Choose PDF File"}
                        </span>
                      </Button>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isUploading || !file || !subjectName.trim()}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                        Processing Your Syllabus...
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="mr-3 h-5 w-5" />
                        Process with AI
                        <ArrowRight className="ml-3 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  {/* Progress Indicator */}
                  {isUploading && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
                        <span className="text-blue-700 font-medium">
                          Our AI is analyzing your syllabus...
                        </span>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Feature Showcase */}
          <div className="order-1 lg:order-2">
            <div className="space-y-8">
              {/* Main Feature Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                    <BrainCircuit className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    AI-Powered Processing
                  </h3>
                  <p className="text-gray-600">
                    Our advanced AI automatically extracts and organizes your
                    syllabus content
                  </p>
                </div>

                {/* Process Steps */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Upload PDF</p>
                      <p className="text-sm text-gray-600">
                        Select your syllabus file
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">AI Analysis</p>
                      <p className="text-sm text-gray-600">
                        Extract chapters and topics
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Ready to Study
                      </p>
                      <p className="text-sm text-gray-600">
                        Generate tests and track progress
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Instant Organization
                  </h4>
                  <p className="text-sm text-gray-600">
                    Automatically organize your syllabus into structured
                    chapters and topics
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Smart Learning
                  </h4>
                  <p className="text-sm text-gray-600">
                    Generate targeted tests and track your learning progress
                    effectively
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
