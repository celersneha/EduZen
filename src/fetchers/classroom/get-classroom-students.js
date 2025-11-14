import dbConnect from '@/lib/db';
import ClassroomModel from '@/models/classroom.model';
import TeacherModel from '@/models/teacher.model';
import StudentModel from '@/models/student.model';
import UserModel from '@/models/user.model';
import TestModel from '@/models/test.model';
import SubjectModel from '@/models/subject.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

/**
 * Fetcher to get all students in a classroom with their details and test results
 * @param {string} classroomId - Classroom ID
 * @returns {Promise<{data: array | null, error: string | null}>}
 */
export async function getClassroomStudents(classroomId) {
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

    if (!classroomId) {
      return {
        data: null,
        error: 'Classroom ID is required',
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

    // Find classroom and verify teacher owns it
    const classroom = await ClassroomModel.findOne({
      _id: classroomId,
      teacher: teacher._id,
    })
      .populate({
        path: 'subject',
        select: 'subjectName _id',
      })
      .select('classroomName classroomCode students subject');

    if (!classroom) {
      return {
        data: null,
        error: 'Classroom not found or you don\'t have access to it',
      };
    }

    // Get all students in the classroom
    const studentIds = classroom.students || [];
    
    if (studentIds.length === 0) {
      return {
        data: [],
        error: null,
      };
    }

    // Get students with their user details
    const students = await StudentModel.find({
      _id: { $in: studentIds },
    })
      .populate({
        path: 'userId',
        select: 'name email',
      })
      .select('userId classrooms createdAt');

    // Get subject ID for filtering tests
    const subjectId = classroom.subject?._id;

    // Get all test results for these students for this subject
    // Note: Test model's studentId references Student model, not User model
    const allTests = subjectId
      ? await TestModel.find({
          studentId: { $in: studentIds },
          subject: subjectId,
        })
          .sort({ createdAt: -1 })
          .select('studentId chapterName topicName testScore difficultyLevel createdAt')
      : [];

    // Organize tests by student
    const testsByStudent = {};
    allTests.forEach((test) => {
      const studentIdStr = test.studentId.toString();
      if (!testsByStudent[studentIdStr]) {
        testsByStudent[studentIdStr] = [];
      }
      testsByStudent[studentIdStr].push({
        id: test._id.toString(),
        chapterName: test.chapterName,
        topicName: test.topicName,
        testScore: test.testScore,
        difficultyLevel: test.difficultyLevel,
        createdAt: test.createdAt,
      });
    });

    // Combine student data with their tests
    const studentsWithTests = students.map((student) => {
      const studentIdStr = student._id.toString();
      const tests = testsByStudent[studentIdStr] || [];
      
      // Calculate statistics
      const totalTests = tests.length;
      const averageScore = totalTests > 0
        ? tests.reduce((sum, test) => sum + (test.testScore || 0), 0) / totalTests
        : 0;
      
      const testsByDifficulty = {
        easy: tests.filter((t) => t.difficultyLevel === 'easy').length,
        medium: tests.filter((t) => t.difficultyLevel === 'medium').length,
        hard: tests.filter((t) => t.difficultyLevel === 'hard').length,
      };

      return {
        id: student._id.toString(),
        userId: student.userId?._id.toString(),
        name: student.userId?.name || 'Unknown',
        email: student.userId?.email || 'No email',
        totalTests,
        averageScore: Math.round(averageScore * 10) / 10,
        testsByDifficulty,
        recentTests: tests.slice(0, 5), // Last 5 tests
        allTests: tests,
        joinedAt: student.createdAt,
      };
    });

    return {
      data: {
        classroom: {
          id: classroom._id.toString(),
          name: classroom.classroomName,
          code: classroom.classroomCode,
          subjectName: classroom.subject?.subjectName || null,
        },
        students: studentsWithTests,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching classroom students:', error);
    return {
      data: null,
      error: 'Failed to fetch classroom students',
    };
  }
}

