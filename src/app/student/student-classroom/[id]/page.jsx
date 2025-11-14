import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getAnnouncements } from '@/fetchers/announcement/get-announcements';
import { getClassrooms } from '@/fetchers/classroom/get-classrooms';
import { getVideoLectures } from '@/fetchers/subject/get-video-lectures';
import { getNotes } from '@/fetchers/subject/get-notes';
import { getSyllabus } from '@/fetchers/subject/get-syllabus';
import { StudentClassroomDetailClient } from './client';

export const metadata = {
  title: 'Classroom Details | EduZen',
  description: 'View classroom syllabus, videos, notes, and take tests',
};

export default async function StudentClassroomPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'student') {
    redirect('/student/dashboard');
  }

  const resolvedParams = await params;
  const classroomId = resolvedParams.id;

  const { data: classrooms, error } = await getClassrooms();

  if (error) {
    return <div>Error: {error}</div>;
  }

  const classroom = classrooms?.find((c) => c.id === classroomId);

  if (!classroom) {
    redirect('/student/student-classroom/list');
  }

  // Fetch all data in parallel
  const [
    { data: announcements },
    { data: videoLectures },
    { data: notes },
    { data: syllabus },
  ] = await Promise.all([
    getAnnouncements(classroomId),
    getVideoLectures(classroomId),
    getNotes(classroomId),
    getSyllabus(classroomId),
  ]);

  return (
    <StudentClassroomDetailClient
      classroom={classroom}
      announcements={announcements || []}
      videoLectures={videoLectures || []}
      notes={notes || []}
      syllabus={syllabus}
    />
  );
}
