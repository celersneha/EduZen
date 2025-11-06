import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { AddSubjectClient } from './add-subject-client';

export const metadata = {
  title: 'Add Subject | EduZen',
  description: 'Upload your syllabus PDF and let AI organize it',
};

export default async function AddSubjectPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return <AddSubjectClient />;
}
