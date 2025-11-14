'use server';

import { getSyllabus } from '@/fetchers/subject/get-syllabus';

/**
 * Server action to get syllabus data for a classroom
 * Wraps the getSyllabus fetcher for use in client components
 * @param {string} classroomId - Classroom ID
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function getSyllabusAction(classroomId) {
  try {
    return await getSyllabus(classroomId);
  } catch (error) {
    console.error('Error in getSyllabusAction:', error);
    return {
      data: null,
      error: 'Failed to fetch syllabus',
    };
  }
}

