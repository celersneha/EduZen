'use server';

import dbConnect from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import TestModel from '@/models/test.model';
import StudentModel from '@/models/student.model';
import SubjectModel from '@/models/subject.model';
import ClassroomModel from '@/models/classroom.model';
import { revalidatePath } from 'next/cache';

/**
 * Server action to save a test result
 * @param {object} testData - Test result data
 * @param {string} testData.studentId - User ID (will be converted to Student model ID)
 * @param {string} testData.subjectId - Subject ID or Classroom ID (will be converted to Subject ID)
 * @param {string} testData.chapterName - Chapter name
 * @param {string} testData.topicName - Topic name
 * @param {number} testData.testScore - Test score (0-10)
 * @param {string} testData.difficultyLevel - Difficulty level
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function saveTestResult(testData) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return {
        data: null,
        error: 'Unauthorized',
      };
    }

    const {
      studentId, // This is actually the User ID from session
      subjectId, // This might be Subject ID or Classroom ID
      chapterName,
      topicName,
      testScore,
      difficultyLevel,
    } = testData;

    // Validate required fields
    if (!studentId || !subjectId || !chapterName || !difficultyLevel) {
      return {
        data: null,
        error: 'Missing required fields',
      };
    }

    // Convert User ID to Student model ID
    const student = await StudentModel.findOne({ userId: studentId });
    if (!student) {
      return {
        data: null,
        error: 'Student record not found',
      };
    }

    // Ensure we have the actual Subject ID (not Classroom ID)
    let actualSubjectId = subjectId;
    
    // First, check if subjectId is actually a Subject ID
    let subject = await SubjectModel.findById(subjectId);
    
    // If not found, it might be a Classroom ID - find the subject for that classroom
    if (!subject) {
      const classroom = await ClassroomModel.findById(subjectId);
      if (classroom && classroom.subject) {
        subject = await SubjectModel.findById(classroom.subject);
        if (subject) {
          actualSubjectId = subject._id;
        }
      }
    } else {
      actualSubjectId = subject._id;
    }

    // Verify subject exists
    if (!subject) {
      return {
        data: null,
        error: 'Subject not found',
      };
    }

    // Create new test record with Student model ID and actual Subject ID
    const testResult = new TestModel({
      studentId: student._id, // Use Student model ID, not User ID
      subject: actualSubjectId, // Use actual Subject ID, not Classroom ID
      chapterName,
      topicName,
      testScore,
      difficultyLevel,
    });

    await testResult.save();

    // Revalidate dashboard to show updated metrics
    revalidatePath('/student/dashboard');

    return {
      data: {
        message: 'Test result saved successfully',
        testId: testResult._id.toString(),
      },
      error: null,
    };
  } catch (error) {
    console.error('Error saving test result:', error);
    return {
      data: null,
      error: 'Failed to save test result',
    };
  }
}

