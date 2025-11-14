import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getClassroomStudents } from '@/fetchers/classroom/get-classroom-students';
import { ClassroomStudentsClient } from './client';

export const metadata = {
  title: 'Classroom Students | EduZen',
  description: 'View all students and their test results in this classroom',
};

export default async function ClassroomStudentsPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'teacher') {
    redirect('/teacher/dashboard');
  }

  const resolvedParams = await params;
  const classroomId = resolvedParams.id;

  const { data, error } = await getClassroomStudents(classroomId);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Students
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ClassroomStudentsClient
      classroom={data?.classroom}
      students={data?.students || []}
    />
  );
}

