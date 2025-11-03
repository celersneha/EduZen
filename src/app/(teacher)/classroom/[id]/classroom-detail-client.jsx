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

export function ClassroomDetailClient({ classroom }) {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [inviteEmails, setInviteEmails] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [copied, setCopied] = useState(false);

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
      </div>
    </div>
  );
}

