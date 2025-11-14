'use server';

import dbConnect from '@/lib/dbConnect';
import SubjectModel from '@/models/subject.model';
import ClassroomModel from '@/models/classroom.model';
import TeacherModel from '@/models/teacher.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { revalidatePath } from 'next/cache';

/**
 * Server action to create a subject for a classroom
 * @param {FormData} formData - Form data containing subjectName, subjectDescription, and classroomId
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function createSubject(formData) {
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

    const subjectName = formData.get('subjectName');
    const subjectDescription = formData.get('subjectDescription') || '';
    const classroomId = formData.get('classroomId');

    if (!subjectName || !classroomId) {
      return {
        data: null,
        error: 'Subject name and classroom ID are required',
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

    // Verify teacher owns the classroom
    const classroom = await ClassroomModel.findOne({
      _id: classroomId,
      teacher: teacher._id,
    });

    if (!classroom) {
      return {
        data: null,
        error: 'Classroom not found or you don\'t have access to it',
      };
    }

    // Check if classroom already has a subject
    if (classroom.subject) {
      return {
        data: null,
        error: 'This classroom already has a subject. Each classroom can only have one subject.',
      };
    }

    // Create subject
    const subject = await SubjectModel.create({
      subjectName: subjectName.trim(),
      subjectDescription: subjectDescription.trim(),
      classroom: classroomId,
      chapters: [],
    });

    // Update classroom with the subject
    await ClassroomModel.findByIdAndUpdate(
      classroomId,
      { subject: subject._id },
      { new: true }
    );

    // Revalidate paths
    revalidatePath(`/classroom/${classroomId}`);
    revalidatePath(`/classroom/${classroomId}/subject`);
    revalidatePath('/teacher/dashboard');

    return {
      data: {
        subject: {
          id: subject._id.toString(),
          subjectName: subject.subjectName,
          subjectDescription: subject.subjectDescription,
        },
      },
      error: null,
    };
  } catch (error) {
    console.error('Error creating subject:', error);
    return {
      data: null,
      error: 'Failed to create subject',
    };
  }
}

