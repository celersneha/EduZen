import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getClassrooms } from '@/fetchers/classroom/get-classrooms';
import { TeacherDashboardClient } from './client';

export const metadata = {
  title: 'Teacher Dashboard | EduZen',
  description: 'Manage your classrooms and track student progress',
};

export default async function TeacherDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'teacher') {
    redirect('/login');
  }

  const { data: classrooms, error } = await getClassrooms();

  return (
    <TeacherDashboardClient
      classrooms={classrooms || []}
      error={error}
      userName={session.user.name}
    />
  );
}
