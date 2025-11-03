import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getClassrooms } from '@/fetchers/get-classrooms';
import { StudentClassroomsClient } from './student-classrooms-client';

export const metadata = {
  title: 'My Classrooms | EduZen',
  description: "View all classrooms you've joined",
};

export default async function StudentClassroomsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'student') {
    redirect('/dashboard');
  }

  const { data: classrooms, error } = await getClassrooms();

  return <StudentClassroomsClient classrooms={classrooms || []} error={error} />;
}
