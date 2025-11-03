'use server';

import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import TestModel from '@/models/test.model';
import { revalidatePath } from 'next/cache';

/**
 * Server action to save a test result
 * @param {object} testData - Test result data
 * @param {string} testData.studentId - Student ID
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
      studentId,
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

    // Create new test record
    const testResult = new TestModel({
      studentId,
      subject: subjectId,
      chapterName,
      topicName,
      testScore,
      difficultyLevel,
    });

    await testResult.save();

    // Revalidate dashboard to show updated metrics
    revalidatePath('/dashboard');

    return {
      data: {
        message: 'Test result saved successfully',
        testId: testResult._id,
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

