'use server';

import dbConnect from '@/lib/dbConnect';
import ClassroomModel from '@/models/classroom.model';
import TeacherModel from '@/models/teacher.model';
import UserModel from '@/models/user.model';
import NotificationModel from '@/models/notification.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import sendClassroomInvite from './utils/send-classroom-invite';

/**
 * Server action to send classroom invitations to students
 * @param {string} classroomId - Classroom ID
 * @param {string[]} studentEmails - Array of student email addresses
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function inviteStudents(classroomId, studentEmails) {
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

    if (!classroomId || !studentEmails || !Array.isArray(studentEmails)) {
      return {
        data: null,
        error: 'Classroom ID and student emails array are required',
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
    });

    if (!classroom) {
      return {
        data: null,
        error: 'Classroom not found or you don\'t have access to it',
      };
    }

    // Get teacher's name from user
    const teacherUser = await UserModel.findById(user.id);
    const teacherName = teacherUser?.name || 'Your Teacher';

    // Send invitations to each student email
    const results = [];
    for (const email of studentEmails) {
      try {
        const emailResult = await sendClassroomInvite(
          email,
          classroom.classroomName,
          classroom.classroomCode,
          teacherName
        );

        // Create notification for the student if they have an account
        try {
          const studentUser = await UserModel.findOne({ email, role: 'student' });
          if (studentUser) {
            await NotificationModel.create({
              userId: studentUser._id,
              type: 'classroom_invitation',
              title: 'Classroom Invitation',
              message: `${teacherName} has invited you to join "${classroom.classroomName}"`,
              isRead: false,
              classroomId: classroom._id,
              classroomCode: classroom.classroomCode,
              actionUrl: `/classroom/join?code=${classroom.classroomCode}`,
              metadata: {
                teacherName,
                classroomName: classroom.classroomName,
              },
            });
          }
        } catch (notifError) {
          // Log but don't fail the invitation if notification creation fails
          console.error(`Error creating notification for ${email}:`, notifError);
        }

        results.push({
          email,
          success: emailResult.success,
          message: emailResult.message,
        });
      } catch (error) {
        console.error(`Error sending invite to ${email}:`, error);
        results.push({
          email,
          success: false,
          message: 'Failed to send invitation',
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return {
      data: {
        message: `Invitations sent. ${successCount} successful, ${failCount} failed.`,
        results,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error sending invitations:', error);
    return {
      data: null,
      error: 'Failed to send invitations',
    };
  }
}

