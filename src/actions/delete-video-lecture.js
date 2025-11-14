"use server";

import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import VideoLectureModel from "@/models/video-lecture.model";
import TeacherModel from "@/models/teacher.model";
import ClassroomModel from "@/models/classroom.model";
import { deleteVideoFromCloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

/**
 * Server action to delete a video lecture
 * @param {string} videoId - Video lecture ID
 * @param {string} classroomId - Classroom ID for verification
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function deleteVideoLecture(videoId, classroomId) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "teacher") {
      return {
        data: null,
        error: "Unauthorized - Only teachers can delete video lectures",
      };
    }

    if (!videoId || !classroomId) {
      return {
        data: null,
        error: "Video ID and classroom ID are required",
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

    // Find the video lecture
    const videoLecture = await VideoLectureModel.findOne({
      _id: videoId,
      classroom: classroomId,
    });

    if (!videoLecture) {
      return {
        data: null,
        error: "Video lecture not found",
      };
    }

    // Delete from Cloudinary
    if (videoLecture.cloudinaryPublicId) {
      try {
        await deleteVideoFromCloudinary(videoLecture.cloudinaryPublicId);
      } catch (error) {
        console.error("Error deleting video from Cloudinary:", error);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    await VideoLectureModel.findByIdAndDelete(videoId);

    // Revalidate paths
    revalidatePath(`/classroom/${classroomId}/subject`);
    revalidatePath(`/classroom/${classroomId}`);

    return {
      data: { message: "Video lecture deleted successfully" },
      error: null,
    };
  } catch (error) {
    console.error("Error deleting video lecture:", error);
    return {
      data: null,
      error: error.message || "Failed to delete video lecture",
    };
  }
}

