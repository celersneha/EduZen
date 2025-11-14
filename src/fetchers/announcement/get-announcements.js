import dbConnect from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import AnnouncementModel from '@/models/announcement.model';
import ClassroomModel from '@/models/classroom.model';
import TeacherModel from '@/models/teacher.model';
import StudentModel from '@/models/student.model';

/**
 * Fetcher to get announcements for a specific classroom
 * @param {string} classroomId - Classroom ID
 * @returns {Promise<{data: array | null, error: string | null}>}
 */
export async function getAnnouncements(classroomId) {
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
        student.classrooms.some(
          (id) => id.toString() === classroomId
        )
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

    // Fetch announcements, sorted by pinned first, then by creation date (newest first)
    const announcements = await AnnouncementModel.find({
      classroom: classroomId,
    })
      .populate({
        path: 'teacher',
        populate: { path: 'userId', select: 'name' },
      })
      .sort({ isPinned: -1, createdAt: -1 })
      .lean();

    const formattedAnnouncements = announcements.map((announcement) => ({
      id: announcement._id.toString(),
      title: announcement.title,
      content: announcement.content,
      isPinned: announcement.isPinned,
      createdAt: announcement.createdAt,
      teacherName:
        announcement.teacher?.userId?.name || 'Teacher',
    }));

    return {
      data: formattedAnnouncements,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return {
      data: null,
      error: 'Failed to fetch announcements',
    };
  }
}

