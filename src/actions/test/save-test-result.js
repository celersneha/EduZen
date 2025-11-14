'use server';

import dbConnect from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import TestModel from '@/models/test.model';
import StudentModel from '@/models/student.model';
import { revalidatePath } from 'next/cache';

/**
 * Server action to save a test result
 * @param {object} testData - Test result data
 * @param {string} testData.studentId - User ID (will be converted to Student model ID)
 * @param {string} testData.subjectId - Subject ID
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
      subjectId,
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

    // Create new test record with Student model ID
    const testResult = new TestModel({
      studentId: student._id, // Use Student model ID, not User ID
      subject: subjectId,
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

