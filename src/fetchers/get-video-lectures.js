import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import VideoLectureModel from '@/models/video-lecture.model';
import ClassroomModel from '@/models/classroom.model';
import TeacherModel from '@/models/teacher.model';
import StudentModel from '@/models/student.model';

/**
 * Fetcher to get video lectures for a specific classroom
 * @param {string} classroomId - Classroom ID
 * @returns {Promise<{data: array | null, error: string | null}>}
 */
export async function getVideoLectures(classroomId) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
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

    // Verify user has access to this classroom
    const classroom = await ClassroomModel.findById(classroomId);
    if (!classroom) {
      return {
        data: null,
        error: 'Classroom not found',
      };
    }

    // Check if user is teacher or student in this classroom
    let hasAccess = false;
    if (session.user.role === 'teacher') {
      const teacher = await TeacherModel.findOne({ userId: session.user.id });
      if (teacher && classroom.teacher.toString() === teacher._id.toString()) {
        hasAccess = true;
      }
    } else if (session.user.role === 'student') {
      const student = await StudentModel.findOne({ userId: session.user.id });
      if (
        student &&
        student.classrooms.some((id) => id.toString() === classroomId)
      ) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return {
        data: null,
        error: 'Access denied to this classroom',
      };
    }

    // Fetch video lectures, sorted by creation date (newest first)
    const videoLectures = await VideoLectureModel.find({
      classroom: classroomId,
    })
      .populate({
        path: 'teacher',
        populate: { path: 'userId', select: 'name' },
      })
      .sort({ createdAt: -1 })
      .lean();

    const formattedLectures = videoLectures.map((lecture) => ({
      id: lecture._id.toString(),
      title: lecture.title,
      description: lecture.description,
      url: lecture.cloudinaryUrl,
      thumbnailUrl: lecture.thumbnailUrl,
      duration: lecture.duration,
      fileSize: lecture.fileSize,
      chapter: lecture.chapter,
      topic: lecture.topic,
      createdAt: lecture.createdAt,
      teacherName: lecture.teacher?.userId?.name || 'Teacher',
    }));

    return {
      data: formattedLectures,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching video lectures:', error);
    return {
      data: null,
      error: 'Failed to fetch video lectures',
    };
  }
}

