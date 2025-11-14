"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Mail,
  FileText,
  Copy,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { inviteStudents } from "@/actions/classroom/invite-students";
import { createAnnouncement } from "@/actions/announcement/create-announcement";
import {
  Megaphone,
  Pin,
  Send,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateTime } from "@/shared/utils/formatters";

export function ClassroomDetailClient({
  classroom,
  announcements = [],
  announcementsError = null,
}) {
  const router = useRouter();
  const [inviteEmails, setInviteEmails] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isPostingAnnouncement, setIsPostingAnnouncement] = useState(false);

  const handleInvite = async () => {
    if (!inviteEmails.trim()) {
      toast.error("Please enter at least one email address");
      return;
    }

    const emails = inviteEmails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (emails.length === 0) {
      toast.error("Please enter valid email addresses");
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
      setInviteEmails("");
    } catch (error) {
      console.error("Error sending invitations:", error);
      toast.error("Failed to send invitations");
    } finally {
      setIsInviting(false);
    }
  };

  const copyJoinLink = () => {
    const baseUrl = window.location.origin;
    const joinLink = `${baseUrl}/student-classroom/join?code=${classroom.classroomCode}`;
    navigator.clipboard.writeText(joinLink);
    setCopied(true);
    toast.success("Join link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      toast.error("Please fill in both title and content");
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

      toast.success("Announcement posted successfully!");
      setAnnouncementTitle("");
      setAnnouncementContent("");
      setIsPinned(false);
      setShowAnnouncementForm(false);
      router.refresh();
    } catch (error) {
      console.error("Error posting announcement:", error);
      toast.error("Failed to post announcement");
    } finally {
      setIsPostingAnnouncement(false);
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
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">
                    {classroom.studentCount || 0}
                  </span>
                  {classroom.studentCount > 0 && (
                    <Link href={`/classroom/${classroom.id}/students`}>
                      <Button variant="outline" size="sm">
                        View Students
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Subject
                </span>
                <div className="text-right">
                  {classroom.subject ? (
                    <>
                      <span className="text-2xl font-bold block">
                        {classroom.subject.subjectName}
                      </span>
                      {classroom.subject.chapterCount > 0 && (
                        <span className="text-xs text-gray-500">
                          {classroom.subject.chapterCount} chapters
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">None</span>
                  )}
                </div>
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

        {/* Subject Management Card - Shows Add Subject if no subject, View Subject if subject exists */}
        {!classroom.subject ? (
          <Card
            className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => router.push(`/classroom/${classroom.id}/add-subject`)}
          >
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Add Subject</h3>
                <p className="text-blue-100">
                  Create and add a subject to this classroom to get started
                </p>
              </div>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Add Subject
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card
            className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-2xl rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => router.push(`/classroom/${classroom.id}/subject`)}
          >
            <CardContent className="pt-6 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {classroom.subject.subjectName}
                </h3>
                <p className="text-blue-100 mb-2">
                  {classroom.subject.chapterCount > 0
                    ? `${classroom.subject.chapterCount} chapters available`
                    : "Subject created - upload syllabus to add chapters"}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm text-blue-100">
                      {classroom.subject.chapterCount > 0
                        ? "Syllabus uploaded"
                        : "No syllabus yet"}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 ml-4"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        )}

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
                {showAnnouncementForm ? "Cancel" : "New Announcement"}
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
              {announcementsError ? (
                <div className="text-center py-8 text-red-500">
                  <Megaphone className="h-12 w-12 mx-auto mb-2 text-red-400" />
                  <p>Error loading announcements: {announcementsError}</p>
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Megaphone className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>
                    No announcements yet. Create one to keep students informed!
                  </p>
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`p-4 rounded-lg border ${
                      announcement.isPinned
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-white border-gray-200"
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
                        {formatDateTime(announcement.createdAt)}
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
      </div>
    </div>
  );
}
