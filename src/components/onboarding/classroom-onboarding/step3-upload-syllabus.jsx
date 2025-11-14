'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadClassroomSyllabus } from '@/actions/subject/upload-classroom-syllabus';

export function Step3UploadSyllabus({
  formData,
  onComplete,
  onNext,
  classroomId,
  subjectId,
  isLoading,
  setIsLoading,
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      setFile(selectedFile);
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!classroomId || !subjectId) {
      toast.error('Classroom or subject information is missing');
      return;
    }

    setIsProcessing(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('pdf', file);
      formDataObj.append('subjectName', formData.subjectName);
      formDataObj.append('classroomId', classroomId);

      const { data, error } = await uploadClassroomSyllabus(formDataObj);

      if (error) {
        toast.error(error);
        return;
      }

      setPreview(data.subject);
      onComplete({ syllabusData: data.subject });
      toast.success('Syllabus processed successfully!');
    } catch (error) {
      console.error('Error uploading syllabus:', error);
      toast.error('Failed to process syllabus');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    if (!preview) {
      toast.error('Please upload and process the syllabus first');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="pdf-upload">Upload Syllabus PDF</Label>
        <div className="mt-2">
          <Input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={isProcessing || isLoading}
            className="h-12"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Upload a PDF file containing your syllabus. Our AI will extract
            chapters and topics automatically.
          </p>
        </div>
      </div>

      {file && !preview && (
        <Button
          onClick={handleUpload}
          disabled={isProcessing || isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing with AI...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Process Syllabus
            </>
          )}
        </Button>
      )}

      {preview && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              Syllabus Processed Successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Chapters: {preview.chapters?.length || 0}</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {preview.chapters?.map((chapter, idx) => (
                  <div key={idx} className="bg-white p-3 rounded border">
                    <p className="font-medium">{chapter.chapterName}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {chapter.topics?.length || 0} topics
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleContinue}
          disabled={!preview || isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

