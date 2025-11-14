"use server";

import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import AnnouncementModel from "@/models/announcement.model";
import TeacherModel from "@/models/teacher.model";
import ClassroomModel from "@/models/classroom.model";
import { revalidatePath } from "next/cache";

/**
 * Server action to create an announcement for a classroom
 * @param {object} announcementData - Announcement data
 * @param {string} announcementData.classroomId - Classroom ID
 * @param {string} announcementData.title - Announcement title
 * @param {string} announcementData.content - Announcement content
 * @param {boolean} announcementData.isPinned - Whether to pin the announcement
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function createAnnouncement(announcementData) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "teacher") {
      return {
        data: null,
        error: "Unauthorized - Only teachers can create announcements",
      };
    }

    const { classroomId, title, content, isPinned = false } = announcementData;

    if (!classroomId || !title || !content) {
      return {
        data: null,
        error: "Classroom ID, title, and content are required",
      };
    }

    // Verify teacher owns the classroom
    const teacher = await TeacherModel.findOne({ userId: session.user.id });
    if (!teacher) {
      return {
        data: null,
        error: "Teacher record not found",
      };
    }

    const classroom = await ClassroomModel.findOne({
      _id: classroomId,
      teacher: teacher._id,
    });

    if (!classroom) {
      return {
        data: null,
        error: "Classroom not found or access denied",
      };
    }

    // Create announcement
    const announcement = new AnnouncementModel({
      classroom: classroomId,
      teacher: teacher._id,
      title: title.trim(),
      content: content.trim(),
      isPinned,
    });

    await announcement.save();

    // Populate teacher info for response
    await announcement.populate("teacher", "userId");
    await announcement.populate({
      path: "teacher",
      populate: { path: "userId", select: "name" },
    });

    // Revalidate classroom pages
    revalidatePath(`/classroom/${classroomId}`);

    return {
      data: {
        id: announcement._id.toString(),
        title: announcement.title,
        content: announcement.content,
        isPinned: announcement.isPinned,
        createdAt: announcement.createdAt,
        teacherName: announcement.teacher?.userId?.name || "Teacher",
      },
      error: null,
    };
  } catch (error) {
    console.error("Error creating announcement:", error);
    return {
      data: null,
      error: "Failed to create announcement",
    };
  }
}
