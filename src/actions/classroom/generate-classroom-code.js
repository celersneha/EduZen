'use server';

import ClassroomModel from '@/models/classroom.model';
import dbConnect from '@/lib/db';

/**
 * Server action to generate a unique classroom code
 * @returns {Promise<{data: string | null, error: string | null}>}
 */
export async function generateClassroomCode() {
  try {
    await dbConnect();

    // Generate a random code
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();

    // Get count of existing classrooms to ensure uniqueness
    const count = await ClassroomModel.countDocuments();

    // Append count to ensure uniqueness
    let classroomCode = `${randomCode}${count}`;

    // Double check uniqueness
    const exists = await ClassroomModel.findOne({ classroomCode });
    if (exists) {
      // If somehow it exists, generate a new one
      const timestamp = Date.now().toString(36).toUpperCase();
      classroomCode = `${randomCode}${timestamp}`;
    }

    return {
      data: classroomCode,
      error: null,
    };
  } catch (error) {
    console.error('Error generating classroom code:', error);
    return {
      data: null,
      error: 'Failed to generate classroom code',
    };
  }
}

