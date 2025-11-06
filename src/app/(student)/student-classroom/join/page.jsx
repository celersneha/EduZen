import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { JoinClassroomClient } from './join-classroom-client';

export const metadata = {
  title: 'Join Classroom | EduZen',
  description: 'Join a classroom using the code provided by your teacher',
};

export default async function JoinClassroomPage({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'student') {
    redirect('/dashboard');
  }

  // In Next.js 15, searchParams is a Promise
  const params = await searchParams;
  const codeFromUrl = params?.code || null;

  return <JoinClassroomClient initialCode={codeFromUrl} />;
}
