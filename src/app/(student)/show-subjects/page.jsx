import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getSubjects } from '@/fetchers/get-subjects';
import { ShowSubjectsClient } from './show-subjects-client';

export const metadata = {
  title: 'My Subjects | EduZen',
  description: 'View and manage your academic subjects',
};

export default async function ShowSubjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const { data: subjects, error } = await getSubjects();

  return <ShowSubjectsClient subjects={subjects || []} error={error} />;
}
