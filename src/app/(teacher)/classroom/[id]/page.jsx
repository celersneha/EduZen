import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getClassrooms } from '@/fetchers/get-classrooms';
import { ClassroomDetailClient } from './classroom-detail-client';

export const metadata = {
  title: 'Classroom Management | EduZen',
  description: 'Manage your classroom, upload syllabus, and invite students',
};

export default async function ClassroomDetailPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'teacher') {
    redirect('/dashboard');
  }

  const { data: classrooms, error } = await getClassrooms();

  if (error) {
    return <div>Error: {error}</div>;
  }

  const classroom = classrooms?.find((c) => c.id === params.id);

  if (!classroom) {
    redirect('/teacher/dashboard');
  }

  return <ClassroomDetailClient classroom={classroom} />;
}
