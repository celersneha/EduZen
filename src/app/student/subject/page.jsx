import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getSyllabus } from '@/fetchers/subject/get-syllabus';
import { SubjectClient } from './client';

export const metadata = {
  title: 'Subject Details | EduZen',
  description: 'View syllabus and take tests for your subject',
};

async function SubjectPageContent({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'student') {
    redirect('/login');
  }

  // Support both classroomId and subjectID for backward compatibility
  const classroomId = searchParams?.classroomId || searchParams?.subjectID;

  if (!classroomId) {
    redirect('/student/student-classroom/list');
  }

  const { data: subject, error } = await getSyllabus(classroomId);

  if (error || !subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Subject not found'}
          </h2>
          <p className="text-gray-600">
            The subject you&apos;re looking for doesn&apos;t exist or you don&apos;t have
            access.
          </p>
        </div>
      </div>
    );
  }

  // Use subject._id or subject.id for the subjectID prop
  const subjectID = subject._id?.toString() || subject.id || classroomId;

  return <SubjectClient subject={subject} subjectID={subjectID} />;
}

export default async function SubjectPage({ searchParams }) {
  const params = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading subject details...</p>
          </div>
        </div>
      }
    >
      <SubjectPageContent searchParams={params} />
    </Suspense>
  );
}
