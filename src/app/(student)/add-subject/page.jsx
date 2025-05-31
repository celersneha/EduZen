"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";

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
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject Name Input */}
            <div className="space-y-2">
              <Label htmlFor="subjectName">Subject Name</Label>
              <Input
                id="subjectName"
                placeholder="Enter subject name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="pdf" className="block text-sm font-medium">
                Upload Syllabus PDF
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                {!fileName ? (
                  <>
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PDF (max. 10MB)</p>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{fileName}</span>
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

              <label
                htmlFor="pdf"
                className="mt-2 inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 cursor-pointer"
              >
                {fileName ? "Change File" : "Select File"}
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isUploading || !file || !subjectName.trim()}
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Processing...
                </>
              ) : (
                "Upload and Process Syllabus"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
