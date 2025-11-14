import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { CreateClassroomClient } from './client';

export const metadata = {
  title: 'Create Classroom | EduZen',
  description: 'Create a new classroom for your students',
};

export default async function CreateClassroomPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'teacher') {
    redirect('/teacher/dashboard');
  }

  return <CreateClassroomClient />;
}
