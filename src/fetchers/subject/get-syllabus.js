import dbConnect from '@/lib/db';
import ClassroomModel from '@/models/classroom.model';
import StudentModel from '@/models/student.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

/**
 * Fetcher to get syllabus data for a classroom
 * @param {string} classroomId - Classroom ID
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function getSyllabus(classroomId) {
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

    if (!classroomId) {
      return {
        data: null,
        error: 'Classroom ID is required',
      };
    }

    // For students, verify they are enrolled in the classroom
    if (user.role === 'student') {
      const student = await StudentModel.findOne({ userId: user.id });
      if (!student) {
        return {
          data: null,
          error: 'Student record not found',
        };
      }

      // Check if student is enrolled in this classroom
      const isEnrolled = student.classrooms.some(
        (classroomRef) => classroomRef.toString() === classroomId
      );

      if (!isEnrolled) {
        return {
          data: null,
          error: 'You are not enrolled in this classroom',
        };
      }
    }

    // Fetch classroom with populated subject - use lean() to get plain objects
    const classroom = await ClassroomModel.findById(classroomId)
      .populate('subject')
      .lean();

    if (!classroom) {
      return {
        data: null,
        error: 'Classroom not found',
      };
    }

    if (!classroom.subject) {
      return {
        data: null,
        error: 'No subject found for this classroom',
      };
    }

    // Get subject data (already plain object due to lean())
    const subjectData = classroom.subject;
    
    // Clean chapters array - ensure all nested data is plain objects/strings
    const cleanChapters = (subjectData.chapters || []).map((chapter) => {
      return {
        chapterName: String(chapter.chapterName || ''),
        topics: Array.isArray(chapter.topics) 
          ? chapter.topics.map(topic => String(topic))
          : [],
      };
    });
    
    // Ensure we return a clean, serializable object
    const cleanSubject = {
      _id: subjectData._id?.toString() || subjectData._id,
      id: subjectData._id?.toString() || subjectData.id,
      subjectName: String(subjectData.subjectName || ''),
      subjectDescription: String(subjectData.subjectDescription || ''),
      chapters: cleanChapters,
      classroom: subjectData.classroom?.toString() || subjectData.classroom,
      createdAt: subjectData.createdAt ? new Date(subjectData.createdAt).toISOString() : null,
      updatedAt: subjectData.updatedAt ? new Date(subjectData.updatedAt).toISOString() : null,
    };

    return {
      data: cleanSubject,
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

