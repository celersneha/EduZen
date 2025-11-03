'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Megaphone,
  Pin,
  BookOpen,
  FileText,
  Video,
  Play,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function StudentClassroomDetailClient({
  classroom,
  announcements = [],
  videoLectures = [],
}) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }
    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`;
  };

  const handleVideoClick = (lecture) => {
    setSelectedVideo(lecture);
    setIsVideoDialogOpen(true);
  };

  const handleCloseVideo = () => {
    setIsVideoDialogOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/classroom/list">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Classrooms
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {classroom.classroomName}
          </h1>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="font-mono text-sm">
              Code: {classroom.classroomCode}
            </Badge>
            {classroom.hasSyllabus && (
              <Badge className="bg-green-500 flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                Syllabus Available
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Announcements Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Megaphone className="h-5 w-5 mr-2" />
                Announcements
              </CardTitle>
              <CardDescription>
                Important updates from your teacher
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Megaphone className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No announcements yet.</p>
                  </div>
                ) : (
                  announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`p-4 rounded-lg border ${
                        announcement.isPinned
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {announcement.title}
                          </h3>
                          {announcement.isPinned && (
                            <Pin className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(announcement.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Posted by {announcement.teacherName}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Video Lectures Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Video Lectures
              </CardTitle>
              <CardDescription>
                Watch video lectures uploaded by your teacher
              </CardDescription>
            </CardHeader>
            <CardContent>
              {videoLectures.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Video className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No video lectures available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videoLectures.map((lecture) => (
                    <div
                      key={lecture.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => handleVideoClick(lecture)}
                    >
                      {lecture.thumbnailUrl ? (
                        <div className="relative aspect-video bg-gray-100">
                          <img
                            src={lecture.thumbnailUrl}
                            alt={lecture.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                            <div className="bg-white/90 rounded-full p-3">
                              <Play className="h-8 w-8 text-blue-600" />
                            </div>
                          </div>
                          {lecture.duration > 0 && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(lecture.duration)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-100 flex items-center justify-center">
                          <Video className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                          {lecture.title}
                        </h3>
                        {lecture.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {lecture.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{formatFileSize(lecture.fileSize)}</span>
                          <span>{formatDate(lecture.createdAt)}</span>
                        </div>
                        {(lecture.chapter || lecture.topic) && (
                          <div className="flex flex-wrap gap-2">
                            {lecture.chapter && (
                              <Badge variant="outline" className="text-xs">
                                {lecture.chapter}
                              </Badge>
                            )}
                            {lecture.topic && (
                              <Badge variant="outline" className="text-xs">
                                {lecture.topic}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            </Card>

          {/* Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-1">
              {/* Classroom Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Classroom Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Classroom Code</p>
                    <p className="font-mono text-lg font-semibold">
                      {classroom.classroomCode}
                    </p>
                  </div>
                  {classroom.hasSyllabus && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Syllabus</p>
                      <Badge className="bg-green-500 flex items-center gap-1 w-fit">
                        <FileText className="h-3 w-3" />
                        {classroom.syllabusName}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {classroom.hasSyllabus && (
                    <Link href={`/subject?classroomId=${classroom.id}`}>
                      <Button className="w-full" variant="outline">
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Syllabus
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Video Player Dialog */}
        <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
          <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
              <DialogTitle>{selectedVideo?.title}</DialogTitle>
              {selectedVideo?.description && (
                <DialogDescription>
                  {selectedVideo.description}
                </DialogDescription>
              )}
            </DialogHeader>
            {selectedVideo && (
              <div className="mt-4">
                <video
                  controls
                  className="w-full rounded-lg"
                  src={selectedVideo.url}
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  {selectedVideo.chapter && (
                    <Badge variant="outline">{selectedVideo.chapter}</Badge>
                  )}
                  {selectedVideo.topic && (
                    <Badge variant="outline">{selectedVideo.topic}</Badge>
                  )}
                  <span>{formatDate(selectedVideo.createdAt)}</span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

