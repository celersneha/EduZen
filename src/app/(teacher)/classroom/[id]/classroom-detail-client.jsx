'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  Mail,
  Upload,
  FileText,
  Copy,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { inviteStudents } from '@/actions/invite-students';
import { uploadClassroomSyllabus } from '@/actions/upload-classroom-syllabus';
import { createAnnouncement } from '@/actions/create-announcement';
import { uploadVideoLecture } from '@/actions/upload-video-lecture';
import { Megaphone, Pin, Send, Video, Upload as UploadIcon, Play, Clock } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export function ClassroomDetailClient({ classroom, announcements = [], videoLectures = [] }) {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [inviteEmails, setInviteEmails] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isPostingAnnouncement, setIsPostingAnnouncement] = useState(false);
  const [showVideoUploadForm, setShowVideoUploadForm] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoChapter, setVideoChapter] = useState('');
  const [videoTopic, setVideoTopic] = useState('');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const handleSyllabusUpload = async (e) => {
    e.preventDefault();
    if (!file || !subjectName.trim()) {
      toast.error('Please select a PDF file and enter a subject name');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('subjectName', subjectName.trim());
      formData.append('classroomId', classroom.id);

      const { data, error } = await uploadClassroomSyllabus(formData);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Syllabus uploaded successfully!');
      setFile(null);
      setSubjectName('');
      router.refresh();
    } catch (error) {
      console.error('Error uploading syllabus:', error);
      toast.error('Failed to upload syllabus');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmails.trim()) {
      toast.error('Please enter at least one email address');
      return;
    }

    const emails = inviteEmails
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (emails.length === 0) {
      toast.error('Please enter valid email addresses');
      return;
    }

    setIsInviting(true);
    try {
      const { data, error } = await inviteStudents(classroom.id, emails);

      if (error) {
        toast.error(error);
        return;
      }

      const successCount = data.results.filter((r) => r.success).length;
      toast.success(`Invitations sent to ${successCount} student(s)`);
      setInviteEmails('');
    } catch (error) {
      console.error('Error sending invitations:', error);
      toast.error('Failed to send invitations');
    } finally {
      setIsInviting(false);
    }
  };

  const copyJoinLink = () => {
    const baseUrl = window.location.origin;
    const joinLink = `${baseUrl}/classroom/join?code=${classroom.classroomCode}`;
    navigator.clipboard.writeText(joinLink);
    setCopied(true);
    toast.success('Join link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    setIsPostingAnnouncement(true);
    try {
      const { data, error } = await createAnnouncement({
        classroomId: classroom.id,
        title: announcementTitle.trim(),
        content: announcementContent.trim(),
        isPinned,
      });

      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Announcement posted successfully!');
      setAnnouncementTitle('');
      setAnnouncementContent('');
      setIsPinned(false);
      setShowAnnouncementForm(false);
      router.refresh();
    } catch (error) {
      console.error('Error posting announcement:', error);
      toast.error('Failed to post announcement');
    } finally {
      setIsPostingAnnouncement(false);
    }
  };

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

  const handleVideoFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('video/')) {
        // Validate file size (500MB max)
        const maxSize = 500 * 1024 * 1024;
        if (selectedFile.size > maxSize) {
          toast.error('Video file size exceeds 500MB limit');
          return;
        }
        setVideoFile(selectedFile);
      } else {
        toast.error('Please select a video file');
      }
    }
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

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (!videoFile || !videoTitle.trim()) {
      toast.error('Please select a video file and enter a title');
      return;
    }

    setIsUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', videoTitle.trim());
      formData.append('description', videoDescription.trim());
      formData.append('classroomId', classroom.id);
      formData.append('chapter', videoChapter.trim());
      formData.append('topic', videoTopic.trim());

      const { data, error } = await uploadVideoLecture(formData);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Video lecture uploaded successfully!');
      setVideoFile(null);
      setVideoTitle('');
      setVideoDescription('');
      setVideoChapter('');
      setVideoTopic('');
      setShowVideoUploadForm(false);
      router.refresh();
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video lecture');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/teacher/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
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
            <Button
              variant="outline"
              size="sm"
              onClick={copyJoinLink}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Join Link
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Classroom Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Classroom Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Total Students
                </span>
                <span className="text-2xl font-bold">
                  {classroom.studentCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Syllabus Status
                </span>
                {classroom.hasSyllabus ? (
                  <Badge className="bg-green-500">
                    {classroom.syllabusName}
                  </Badge>
                ) : (
                  <Badge variant="outline">Not uploaded</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Invite Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Invite Students
              </CardTitle>
              <CardDescription>
                Send email invitations to students to join this classroom
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emails">Student Email Addresses</Label>
                <Textarea
                  id="emails"
                  className="w-full mt-2 resize-none"
                  rows={3}
                  placeholder="Enter email addresses separated by commas&#10;e.g., student1@example.com, student2@example.com"
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  disabled={isInviting}
                />
              </div>
              <Button
                onClick={handleInvite}
                disabled={isInviting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isInviting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invitations
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upload Syllabus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload Syllabus
            </CardTitle>
            <CardDescription>
              Upload a PDF syllabus for this classroom. It will be processed
              using AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSyllabusUpload} className="space-y-4">
              <div>
                <Label htmlFor="subjectName">Subject Name</Label>
                <Input
                  id="subjectName"
                  placeholder="e.g., Mathematics 101"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  disabled={isUploading}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="pdfFile">Syllabus PDF</Label>
                <Input
                  id="pdfFile"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="mt-2"
                />
                {file && (
                  <p className="text-sm text-gray-500 mt-2">
                    Selected: {file.name}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isUploading || !file || !subjectName.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading and processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Syllabus
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Announcements Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Megaphone className="h-5 w-5 mr-2" />
                  Announcements
                </CardTitle>
                <CardDescription>
                  Post important updates and announcements for your students
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                variant="outline"
              >
                {showAnnouncementForm ? 'Cancel' : 'New Announcement'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showAnnouncementForm && (
              <form
                onSubmit={handlePostAnnouncement}
                className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4"
              >
                <div>
                  <Label htmlFor="announcementTitle">Title</Label>
                  <Input
                    id="announcementTitle"
                    placeholder="e.g., Midterm Exam Date"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    disabled={isPostingAnnouncement}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="announcementContent">Content</Label>
                  <Textarea
                    id="announcementContent"
                    placeholder="Write your announcement here..."
                    value={announcementContent}
                    onChange={(e) => setAnnouncementContent(e.target.value)}
                    disabled={isPostingAnnouncement}
                    rows={4}
                    className="mt-2 resize-none"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pinAnnouncement"
                    checked={isPinned}
                    onCheckedChange={setIsPinned}
                    disabled={isPostingAnnouncement}
                  />
                  <Label
                    htmlFor="pinAnnouncement"
                    className="text-sm font-normal cursor-pointer flex items-center"
                  >
                    <Pin className="h-4 w-4 mr-1" />
                    Pin this announcement
                  </Label>
                </div>
                <Button
                  type="submit"
                  disabled={isPostingAnnouncement}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {isPostingAnnouncement ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Post Announcement
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Megaphone className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No announcements yet. Create one to keep students informed!</p>
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Video Lectures
                </CardTitle>
                <CardDescription>
                  Upload and manage video lectures for your students
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowVideoUploadForm(!showVideoUploadForm)}
                variant="outline"
              >
                {showVideoUploadForm ? 'Cancel' : 'Upload Video'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showVideoUploadForm && (
              <form
                onSubmit={handleVideoUpload}
                className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4"
              >
                <div>
                  <Label htmlFor="videoFile">Video File</Label>
                  <Input
                    id="videoFile"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    disabled={isUploadingVideo}
                    className="mt-2"
                  />
                  {videoFile && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {videoFile.name} ({formatFileSize(videoFile.size)})
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum file size: 500MB. Supported formats: MP4, WebM, etc.
                  </p>
                </div>
                <div>
                  <Label htmlFor="videoTitle">Title *</Label>
                  <Input
                    id="videoTitle"
                    placeholder="e.g., Introduction to Calculus"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    disabled={isUploadingVideo}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="videoDescription">Description</Label>
                  <Textarea
                    id="videoDescription"
                    placeholder="Brief description of the video lecture..."
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    disabled={isUploadingVideo}
                    rows={3}
                    className="mt-2 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="videoChapter">Chapter (Optional)</Label>
                    <Input
                      id="videoChapter"
                      placeholder="e.g., Chapter 1"
                      value={videoChapter}
                      onChange={(e) => setVideoChapter(e.target.value)}
                      disabled={isUploadingVideo}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="videoTopic">Topic (Optional)</Label>
                    <Input
                      id="videoTopic"
                      placeholder="e.g., Limits and Continuity"
                      value={videoTopic}
                      onChange={(e) => setVideoTopic(e.target.value)}
                      disabled={isUploadingVideo}
                      className="mt-2"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isUploadingVideo || !videoFile || !videoTitle.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {isUploadingVideo ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading video...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Upload Video Lecture
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="space-y-4">
              {videoLectures.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Video className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No video lectures yet. Upload one to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videoLectures.map((lecture) => (
                    <div
                      key={lecture.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {lecture.thumbnailUrl ? (
                        <div className="relative aspect-video bg-gray-100">
                          <img
                            src={lecture.thumbnailUrl}
                            alt={lecture.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="h-12 w-12 text-white" />
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
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatFileSize(lecture.fileSize)}</span>
                          <span>{formatDate(lecture.createdAt)}</span>
                        </div>
                        {(lecture.chapter || lecture.topic) && (
                          <div className="mt-2 flex flex-wrap gap-2">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

