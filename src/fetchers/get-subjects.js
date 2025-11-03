import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import StudentModel from '@/models/student.model';

/**
 * Fetcher to get all subjects for the current student
 * @returns {Promise<{data: array | null, error: string | null}>}
 */
export async function getSubjects() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user = session?.user;
    if (!user) {
      return {
        data: null,
        error: 'Unauthorized',
      };
    }

    const studentId = user.id;

    // Get the full user document with populated subjects
    const studentWithSubjects = await StudentModel.findById(studentId).populate(
      'subjects'
    );

    if (!studentWithSubjects) {
      return {
        data: null,
        error: 'Student not found',
      };
    }

    const subjects = studentWithSubjects.subjects || [];

    return {
      data: subjects,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return {
      data: null,
      error: 'Failed to fetch subjects',
    };
  }
}

