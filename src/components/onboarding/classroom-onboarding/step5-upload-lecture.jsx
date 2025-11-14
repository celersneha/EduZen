'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2, Video, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadVideoLecture } from '@/actions/subject/upload-video-lecture';
import { getSyllabusAction } from '@/actions/subject/get-syllabus';

export function Step5UploadLecture({
  formData,
  onComplete,
  onFinish,
  classroomId,
  onSkip,
  isLoading,
  setIsLoading,
}) {
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [syllabus, setSyllabus] = useState(null);
  const [availableTopics, setAvailableTopics] = useState([]);

  // Fetch syllabus to get chapters and topics
  useEffect(() => {
    const fetchSyllabus = async () => {
      if (!classroomId) return;

      try {
        const { data, error } = await getSyllabusAction(classroomId);
        if (error) {
          console.error('Error fetching syllabus:', error);
          return;
        }
        if (data) {
          setSyllabus(data);
        }
      } catch (error) {
        console.error('Error fetching syllabus:', error);
      }
    };

    fetchSyllabus();
  }, [classroomId]);

  // Update available topics when chapter changes
  useEffect(() => {
    if (selectedChapter && syllabus) {
      const chapter = syllabus.chapters?.find(
        (ch) => ch.chapterName === selectedChapter
      );
      if (chapter) {
        setAvailableTopics(chapter.topics || []);
        setSelectedTopic(''); // Reset topic when chapter changes
      }
    } else {
      setAvailableTopics([]);
    }
  }, [selectedChapter, syllabus]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }
      setVideoFile(file);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a title for the lecture');
      return;
    }

    if (!selectedChapter || !selectedTopic) {
      toast.error('Please select both chapter and topic');
      return;
    }

    if (!classroomId) {
      toast.error('Classroom ID is missing');
      return;
    }

    setIsLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('video', videoFile);
      formDataObj.append('title', title.trim());
      formDataObj.append('description', description.trim());
      formDataObj.append('classroomId', classroomId);
      formDataObj.append('chapter', selectedChapter);
      formDataObj.append('topic', selectedTopic);

      const { data, error } = await uploadVideoLecture(formDataObj);

      if (error) {
        toast.error(error);
        return;
      }

      onComplete({ videoData: data });
      toast.success('Video lecture uploaded successfully!');
      onFinish();
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video lecture');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your first video lecture. Each video must be associated with a
          specific topic from your syllabus. You can also do this later from the
          classroom dashboard.
        </p>

        {!syllabus && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-sm text-yellow-800">
                Please upload and process the syllabus first to select topics for
                your video lectures.
              </p>
            </CardContent>
          </Card>
        )}

        {syllabus && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="video-upload">Video File</Label>
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={isLoading}
                className="h-12 mt-2"
              />
            </div>

            <div>
              <Label htmlFor="title">Lecture Title</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to Algebra"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                className="h-12 mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the lecture..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={3}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chapter">Chapter *</Label>
                <Select
                  value={selectedChapter}
                  onValueChange={setSelectedChapter}
                  disabled={isLoading}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {syllabus.chapters?.map((chapter, idx) => (
                      <SelectItem key={idx} value={chapter.chapterName}>
                        {chapter.chapterName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="topic">Topic *</Label>
                <Select
                  value={selectedTopic}
                  onValueChange={setSelectedTopic}
                  disabled={isLoading || !selectedChapter}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTopics.map((topic, idx) => (
                      <SelectItem key={idx} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          disabled={isLoading}
        >
          Skip for now
        </Button>
        <Button
          onClick={handleUpload}
          disabled={
            isLoading ||
            !videoFile ||
            !title.trim() ||
            !selectedChapter ||
            !selectedTopic
          }
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              Upload Lecture
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

