"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/file-upload";
import {
  FileText,
  ArrowLeft,
  Video,
  Play,
  Clock,
  BookOpen,
  Download,
  ExternalLink,
  GraduationCap,
  Layers,
  Sparkles,
} from "lucide-react";
import { uploadVideoLecture } from "@/actions/upload-video-lecture";
import { uploadNote } from "@/actions/upload-note";
import { deleteVideoLecture } from "@/actions/delete-video-lecture";
import { deleteNote } from "@/actions/delete-note";

export function ClassroomSubjectClient({
  classroomId,
  subject,
  videoLectures = [],
  notes = [],
  videoLecturesError = null,
  notesError = null,
}) {
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  // Helper functions
  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get video for a specific topic
  const getVideoForTopic = (chapterName, topicName) => {
    return videoLectures.find(
      (video) =>
        video.chapter === chapterName && video.topic === topicName
    );
  };

  // Get note for a specific topic
  const getNoteForTopic = (chapterName, topicName) => {
    return notes.find(
      (note) => note.chapter === chapterName && note.topic === topicName
    );
  };

  // Create note upload handler for a specific topic
  const createNoteUploadHandler = (chapterName, topicName) => {
    return async (file, metadata) => {
      const formData = new FormData();
      formData.append("title", metadata.title);
      formData.append("description", metadata.description || "");
      formData.append("classroomId", classroomId);
      formData.append("chapter", chapterName);
      formData.append("topic", topicName);
      
      if (file) {
        formData.append("file", file);
        formData.append("content", "");
      } else {
        formData.append("content", metadata.description || "");
      }

      const result = await uploadNote(formData);
      
      if (result.error) {
        return result;
      }

      router.refresh();
      return result;
    };
  };

  // Create video upload handler for a specific topic
  const createVideoUploadHandler = (chapterName, topicName) => {
    return async (file, metadata) => {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", metadata.title);
      formData.append("description", metadata.description || "");
      formData.append("classroomId", classroomId);
      formData.append("chapter", chapterName);
      formData.append("topic", topicName);

      const result = await uploadVideoLecture(formData);
      
      if (result.error) {
        return result;
      }

      router.refresh();
      return result;
    };
  };

  // Create video delete handler
  const createVideoDeleteHandler = (videoId) => {
    return async (file) => {
      const result = await deleteVideoLecture(videoId, classroomId);
      
      if (result.error) {
        toast.error(result.error);
        throw new Error(result.error);
      }

      toast.success("Video deleted successfully");
      router.refresh();
    };
  };

  // Create note delete handler
  const createNoteDeleteHandler = (noteId) => {
    return async (file) => {
      const result = await deleteNote(noteId, classroomId);
      
      if (result.error) {
        toast.error(result.error);
        throw new Error(result.error);
      }

      toast.success("Note deleted successfully");
      router.refresh();
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Modern Header Section */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/classroom/${classroomId}`}>
              <Button 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors -ml-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="font-medium">Back</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-slate-600">Subject Management</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl">
        {!subject ? (
          // Modern Empty State
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-2xl border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="pt-12 pb-16 px-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 mb-6">
                    <FileText className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                    No Subject Yet
                  </h2>
                  <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                    Get started by adding a subject to this classroom. Upload a syllabus PDF and we'll extract the chapters and topics automatically.
                  </p>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 px-8 h-12 text-base font-semibold"
                    onClick={() =>
                      router.push(`/classroom/${classroomId}/add-subject`)
                    }
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Add Subject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Modern Subject Header Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
              <CardHeader className="relative p-8 pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        Active Subject
                      </Badge>
                    </div>
                    <CardTitle className="text-4xl font-bold mb-3 tracking-tight">
                      {subject.subjectName}
                    </CardTitle>
                    {subject.subjectDescription && (
                      <p className="text-indigo-100 text-lg leading-relaxed max-w-2xl">
                        {subject.subjectDescription}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative px-8 pb-8 pt-0">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-100 font-medium">Chapters</p>
                      <p className="text-2xl font-bold">
                        {subject.chapterCount > 0 ? subject.chapterCount : "0"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-100 font-medium">Topics</p>
                      <p className="text-2xl font-bold">
                        {subject.chapters?.reduce((acc, ch) => acc + (ch.topics?.length || 0), 0) || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-100 font-medium">Videos</p>
                      <p className="text-2xl font-bold">{videoLectures.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-100 font-medium">Notes</p>
                      <p className="text-2xl font-bold">{notes.length}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Syllabus Section */}
            {subject.chapters && subject.chapters.length > 0 ? (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-indigo-100">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                      Course Syllabus
                    </h2>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Manage chapters, topics, videos, and notes
                    </p>
                  </div>
                </div>

                <Accordion type="multiple" className="w-full space-y-3">
                  {subject.chapters.map((chapter, chapterIndex) => {
                    const chapterId =
                      chapter._id?.toString() || `chapter-${chapterIndex}`;
                    const topicCount = chapter.topics?.length || 0;
                    
                    return (
                      <AccordionItem
                        key={chapterId}
                        value={chapterId}
                        className="border-0"
                      >
                        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white/80 backdrop-blur-sm">
                          <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
                                  {chapterIndex + 1}
                                </div>
                                <div className="text-left">
                                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {chapter.chapterName}
                                  </h3>
                                  <p className="text-sm text-slate-500 mt-0.5">
                                    {topicCount} {topicCount === 1 ? 'topic' : 'topics'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            {chapter.topics && chapter.topics.length > 0 ? (
                              <div className="space-y-4 mt-4">
                                {chapter.topics.map((topic, topicIndex) => {
                                  const video = getVideoForTopic(
                                    chapter.chapterName,
                                    topic
                                  );
                                  const note = getNoteForTopic(
                                    chapter.chapterName,
                                    topic
                                  );

                                  return (
                                    <div
                                      key={topicIndex}
                                      className="border border-slate-200/60 rounded-xl p-6 bg-gradient-to-br from-slate-50/50 to-white shadow-sm hover:shadow-md transition-all duration-200"
                                    >
                                      <div className="flex items-center gap-3 mb-6">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 font-semibold text-sm">
                                          {topicIndex + 1}
                                        </div>
                                        <h4 className="text-base font-semibold text-slate-900 flex-1">
                                          {topic}
                                        </h4>
                                      </div>

                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {/* Video Card */}
                                        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm">
                                          <CardHeader className="pb-4 px-5 pt-5">
                                            <div className="flex items-center gap-2.5">
                                              <div className="p-2 rounded-lg bg-red-50">
                                                <Video className="h-4 w-4 text-red-600" />
                                              </div>
                                              <CardTitle className="text-sm font-semibold text-slate-900">
                                                Video Lecture
                                              </CardTitle>
                                            </div>
                                          </CardHeader>
                                          <CardContent className="px-5 pb-5">
                                            {video ? (
                                              <FileUpload
                                                onUpload={createVideoUploadHandler(
                                                  chapter.chapterName,
                                                  topic
                                                )}
                                                acceptedTypes={["video/*"]}
                                                maxSize={500 * 1024 * 1024}
                                                label="Upload Video Lecture"
                                                showPreview={true}
                                                showMetadata={true}
                                                required={true}
                                                existingFile={{
                                                  url: video.url,
                                                  fileName: video.title,
                                                  fileType: "video/mp4",
                                                  fileSize: video.fileSize || 0,
                                                  thumbnailUrl: video.thumbnailUrl,
                                                  duration: video.duration,
                                                }}
                                                onView={(file) => {
                                                  setSelectedVideo({
                                                    ...video,
                                                    url: file.url || video.url,
                                                  });
                                                  setIsVideoDialogOpen(true);
                                                }}
                                                onDelete={createVideoDeleteHandler(video.id)}
                                              />
                                            ) : (
                                              <FileUpload
                                                onUpload={createVideoUploadHandler(
                                                  chapter.chapterName,
                                                  topic
                                                )}
                                                acceptedTypes={["video/*"]}
                                                maxSize={500 * 1024 * 1024}
                                                label="Upload Video Lecture"
                                                showPreview={true}
                                                showMetadata={true}
                                                required={true}
                                              />
                                            )}
                                          </CardContent>
                                        </Card>

                                        {/* Notes Card */}
                                        <Card className="border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm">
                                          <CardHeader className="pb-4 px-5 pt-5">
                                            <div className="flex items-center gap-2.5">
                                              <div className="p-2 rounded-lg bg-blue-50">
                                                <FileText className="h-4 w-4 text-blue-600" />
                                              </div>
                                              <CardTitle className="text-sm font-semibold text-slate-900">
                                                Notes
                                              </CardTitle>
                                            </div>
                                          </CardHeader>
                                          <CardContent className="px-5 pb-5">
                                            {note ? (
                                              <FileUpload
                                                onUpload={createNoteUploadHandler(
                                                  chapter.chapterName,
                                                  topic
                                                )}
                                                acceptedTypes={[
                                                  "application/pdf",
                                                  "application/msword",
                                                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                                  "text/plain",
                                                ]}
                                                maxSize={10 * 1024 * 1024}
                                                label="Upload Notes (PDF, DOC, DOCX, TXT)"
                                                showPreview={true}
                                                showMetadata={true}
                                                required={true}
                                                existingFile={
                                                  note.fileUrl
                                                    ? {
                                                        url: note.fileUrl,
                                                        fileName: note.fileName || note.title,
                                                        fileType: note.fileType || "text",
                                                        fileSize: 0,
                                                      }
                                                    : note.content
                                                    ? {
                                                        url: null,
                                                        fileName: note.title,
                                                        fileType: "text",
                                                        fileSize: 0,
                                                      }
                                                    : null
                                                }
                                                onView={(file) => {
                                                  setSelectedNote({
                                                    ...note,
                                                    fileUrl: file?.url || note.fileUrl || null,
                                                    fileName: file?.fileName || note.fileName || note.title,
                                                    fileType: file?.fileType || note.fileType || "text",
                                                    content: note.content || "",
                                                  });
                                                  setIsNoteDialogOpen(true);
                                                }}
                                                onDelete={createNoteDeleteHandler(note.id)}
                                              />
                                            ) : (
                                              <FileUpload
                                                onUpload={createNoteUploadHandler(
                                                  chapter.chapterName,
                                                  topic
                                                )}
                                                acceptedTypes={[
                                                  "application/pdf",
                                                  "application/msword",
                                                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                                  "text/plain",
                                                ]}
                                                maxSize={10 * 1024 * 1024}
                                                label="Upload Notes (PDF, DOC, DOCX, TXT)"
                                                showPreview={true}
                                                showMetadata={true}
                                                required={true}
                                              />
                                            )}
                                          </CardContent>
                                        </Card>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-slate-500">
                                <BookOpen className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                                <p className="text-sm font-medium">No topics found in this chapter.</p>
                              </div>
                            )}
                          </AccordionContent>
                        </Card>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            ) : (
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="pt-12 pb-16 px-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
                      <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No chapters found
                    </h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                      Upload a syllabus PDF to extract chapters and topics automatically.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Video Player Dialog */}
        <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
          <DialogContent className="max-w-5xl w-full">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedVideo?.title}</DialogTitle>
              {selectedVideo?.description && (
                <DialogDescription className="text-base">
                  {selectedVideo.description}
                </DialogDescription>
              )}
            </DialogHeader>
            {selectedVideo && (
              <div className="mt-4">
                <video
                  controls
                  className="w-full rounded-lg shadow-xl"
                  src={selectedVideo.url}
                  preload="metadata"
                  controlsList="nodownload"
                >
                  Your browser does not support the video tag.
                </video>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {selectedVideo.chapter && (
                      <Badge variant="outline" className="font-medium">{selectedVideo.chapter}</Badge>
                    )}
                    {selectedVideo.topic && (
                      <Badge variant="outline" className="font-medium">{selectedVideo.topic}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-slate-600">
                    {selectedVideo.duration > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(selectedVideo.duration)}</span>
                      </div>
                    )}
                    <span>{formatDate(selectedVideo.createdAt)}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.open(selectedVideo.url, "_blank");
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = selectedVideo.url;
                      link.download = `${selectedVideo.title}.mp4`;
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Note/Document Viewer Dialog */}
        <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
          <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedNote?.title}</DialogTitle>
            </DialogHeader>
            {selectedNote && (
              <div className="mt-4">
                {selectedNote.fileUrl ? (
                  <div className="space-y-4">
                    {selectedNote.fileType === "pdf" ? (
                      <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <div className="w-full h-[600px] relative">
                          <object
                            data={`${selectedNote.fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                            type="application/pdf"
                            className="w-full h-full"
                            style={{ minHeight: '600px' }}
                          >
                            <iframe
                              src={`${selectedNote.fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                              className="w-full h-full border-0"
                              title={selectedNote.title}
                              style={{ minHeight: '600px' }}
                            >
                              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                <FileText className="h-16 w-16 text-slate-400 mb-4" />
                                <p className="text-sm text-slate-600 mb-4">
                                  Your browser doesn't support PDF preview.
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => {
                                      window.open(selectedNote.fileUrl, "_blank");
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Open PDF in New Tab
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      const link = document.createElement("a");
                                      link.href = selectedNote.fileUrl;
                                      link.download = selectedNote.fileName || selectedNote.title;
                                      link.click();
                                    }}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download PDF
                                  </Button>
                                </div>
                              </div>
                            </iframe>
                          </object>
                          <div className="absolute top-2 right-2 flex gap-2 z-10">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                window.open(selectedNote.fileUrl, "_blank");
                              }}
                              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Open
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = selectedNote.fileUrl;
                                link.download = selectedNote.fileName || selectedNote.title;
                                link.click();
                              }}
                              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-100 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-600">
                              Having trouble viewing? Use the buttons above to open or download the PDF.
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                window.open(selectedNote.fileUrl, "_blank");
                              }}
                              className="text-xs h-7"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Open PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-slate-200 rounded-lg p-8 text-center bg-slate-50">
                        <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-sm text-slate-600 mb-4">
                          Preview not available for {selectedNote.fileType?.toUpperCase() || "DOCUMENT"} files
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="outline"
                            onClick={() => {
                              window.open(selectedNote.fileUrl, "_blank");
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in New Tab
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = selectedNote.fileUrl;
                              link.download = selectedNote.fileName || selectedNote.title;
                              link.click();
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}
                    {selectedNote.content && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-sm mb-2 text-slate-900">Additional Notes:</h4>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {selectedNote.content}
                        </p>
                      </div>
                    )}
                  </div>
                ) : selectedNote.content ? (
                  <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {selectedNote.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>No content available for this note.</p>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    {selectedNote.chapter && (
                      <Badge variant="outline" className="font-medium">{selectedNote.chapter}</Badge>
                    )}
                    {selectedNote.topic && (
                      <Badge variant="outline" className="font-medium">{selectedNote.topic}</Badge>
                    )}
                  </div>
                  <span>{formatDate(selectedNote.createdAt)}</span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
