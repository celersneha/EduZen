import dbConnect from '@/lib/dbConnect';
import ClassroomModel from '@/models/classroom.model';
import TeacherModel from '@/models/teacher.model';
import StudentModel from '@/models/student.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

/**
 * Fetcher to get classrooms based on user role (teacher or student)
 * @returns {Promise<{data: array | null, error: string | null}>}
 */
export async function getClassrooms() {
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

    if (user.role === 'teacher') {
      // Get teacher's classrooms
      const teacher = await TeacherModel.findOne({ userId: user.id });
      if (!teacher) {
        return {
          data: null,
          error: 'Teacher record not found',
        };
      }

      const classrooms = await ClassroomModel.find({
        teacher: teacher._id,
      })
        .populate('students', 'userId')
        .populate('syllabusId', 'subjectName')
        .select('classroomName classroomCode students syllabusId createdAt')
        .sort({ createdAt: -1 });

      return {
        data: classrooms.map((c) => ({
          id: c._id.toString(),
          classroomName: c.classroomName,
          classroomCode: c.classroomCode,
          studentCount: c.students?.length || 0,
          hasSyllabus: !!c.syllabusId,
          syllabusName: c.syllabusId?.subjectName || null,
          createdAt: c.createdAt,
        })),
        error: null,
      };
    } else if (user.role === 'student') {
      // Get student's classrooms
      const student = await StudentModel.findOne({ userId: user.id });
      if (!student) {
        return {
          data: null,
          error: 'Student record not found',
        };
      }

      const classrooms = await ClassroomModel.find({
        _id: { $in: student.classrooms || [] },
      })
        .populate('teacher', 'userId')
        .populate('syllabusId', 'subjectName')
        .select('classroomName classroomCode teacher syllabusId createdAt')
        .sort({ createdAt: -1 });

      return {
        data: classrooms.map((c) => ({
          id: c._id.toString(),
          classroomName: c.classroomName,
          classroomCode: c.classroomCode,
          hasSyllabus: !!c.syllabusId,
          syllabusName: c.syllabusId?.subjectName || null,
          createdAt: c.createdAt,
        })),
        error: null,
      };
    } else {
      return {
        data: null,
        error: 'Invalid role',
      };
    }
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    return {
      data: null,
      error: 'Failed to fetch classrooms',
    };
  }
}

