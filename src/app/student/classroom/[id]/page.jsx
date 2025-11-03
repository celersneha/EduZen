import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getAnnouncements } from '@/fetchers/get-announcements';
import { getClassrooms } from '@/fetchers/get-classrooms';
import { getVideoLectures } from '@/fetchers/get-video-lectures';
import { StudentClassroomDetailClient } from './student-classroom-detail-client';

export const metadata = {
  title: 'Classroom Details | EduZen',
  description: 'View classroom announcements, video lectures, and syllabus',
};

export default async function StudentClassroomDetailPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'student') {
    redirect('/dashboard');
  }

  const { data: classrooms, error } = await getClassrooms();

  if (error) {
    return <div>Error: {error}</div>;
  }

  const classroom = classrooms?.find((c) => c.id === params.id);

  if (!classroom) {
    redirect('/classroom/list');
  }

  const { data: announcements, error: announcementsError } =
    await getAnnouncements(params.id);

  const { data: videoLectures, error: videoLecturesError } =
    await getVideoLectures(params.id);

  return (
    <StudentClassroomDetailClient
      classroom={classroom}
      announcements={announcements || []}
      videoLectures={videoLectures || []}
    />
  );
}

