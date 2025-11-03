import dbConnect from '@/lib/dbConnect';
import SubjectModel from '@/models/subject.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

/**
 * Fetcher to get syllabus data for a specific subject
 * @param {string} subjectId - Subject ID
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function getSyllabus(subjectId) {
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

    if (!subjectId) {
      return {
        data: null,
        error: 'Subject ID is required',
      };
    }

    // Fetch the subject document which should contain syllabus data
    const subject = await SubjectModel.findById(subjectId);

    if (!subject) {
      return {
        data: null,
        error: 'Subject not found',
      };
    }

    return {
      data: subject,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching syllabus:', error);
    return {
      data: null,
      error: 'Failed to fetch syllabus',
    };
  }
}

