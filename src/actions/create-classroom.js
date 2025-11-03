'use server';

import dbConnect from '@/lib/dbConnect';
import ClassroomModel from '@/models/classroom.model';
import TeacherModel from '@/models/teacher.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { revalidatePath } from 'next/cache';

/**
 * Server action to create a new classroom
 * @param {object} classroomData - Classroom data
 * @param {string} classroomData.classroomName - Name of the classroom
 * @param {string} classroomData.classroomCode - Unique code for the classroom
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function createClassroom(classroomData) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user = session?.user;
    if (!user || user.role !== 'teacher') {
      return {
        data: null,
        error: 'Unauthorized. Teacher access required.',
      };
    }

    const { classroomName, classroomCode } = classroomData;

    if (!classroomName || !classroomCode) {
      return {
        data: null,
        error: 'Classroom name and code are required',
      };
    }

    // Find teacher record
    const teacher = await TeacherModel.findOne({ userId: user.id });
    if (!teacher) {
      return {
        data: null,
        error: 'Teacher record not found',
      };
    }

    // Check if classroom code already exists
    const existingClassroom = await ClassroomModel.findOne({ classroomCode });
    if (existingClassroom) {
      return {
        data: null,
        error: 'Classroom code already exists',
      };
    }

    // Create classroom
    const classroom = await ClassroomModel.create({
      classroomName,
      classroomCode,
      teacher: teacher._id,
      students: [],
      syllabusId: null,
    });

    // Update teacher's classrooms array
    await TeacherModel.findByIdAndUpdate(
      teacher._id,
      { $push: { classrooms: classroom._id } },
      { new: true }
    );

    // Revalidate teacher dashboard
    revalidatePath('/teacher/dashboard');

    return {
      data: {
        message: 'Classroom created successfully',
        classroom: {
          id: classroom._id.toString(),
          classroomName: classroom.classroomName,
          classroomCode: classroom.classroomCode,
        },
      },
      error: null,
    };
  } catch (error) {
    console.error('Error creating classroom:', error);
    return {
      data: null,
      error: 'Failed to create classroom',
    };
  }
}

