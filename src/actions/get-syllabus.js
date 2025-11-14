'use server';

import dbConnect from '@/lib/dbConnect';
import ClassroomModel from '@/models/classroom.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

/**
 * Server action to get syllabus data for a classroom
 * @param {string} classroomId - Classroom ID
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function getSyllabusAction(classroomId) {
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

    // Fetch classroom with populated subject
    const classroom = await ClassroomModel.findById(classroomId).populate(
      'subject'
    );

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

    // Transform subject data for client
    const subjectData = {
      id: classroom.subject._id.toString(),
      subjectName: classroom.subject.subjectName,
      subjectDescription: classroom.subject.subjectDescription,
      chapters: classroom.subject.chapters || [],
      createdAt: classroom.subject.createdAt,
    };

    return {
      data: subjectData,
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

