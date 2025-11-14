"use server";

import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import NoteModel from "@/models/note.model";
import TeacherModel from "@/models/teacher.model";
import ClassroomModel from "@/models/classroom.model";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

/**
 * Server action to delete a note
 * @param {string} noteId - Note ID
 * @param {string} classroomId - Classroom ID for verification
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function deleteNote(noteId, classroomId) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "teacher") {
      return {
        data: null,
        error: "Unauthorized - Only teachers can delete notes",
      };
    }

    if (!noteId || !classroomId) {
      return {
        data: null,
        error: "Note ID and classroom ID are required",
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

    // Find the note
    const note = await NoteModel.findOne({
      _id: noteId,
      classroom: classroomId,
    });

    if (!note) {
      return {
        data: null,
        error: "Note not found",
      };
    }

    // Delete from Cloudinary if file exists
    if (note.fileUrl) {
      try {
        // Extract public ID from Cloudinary URL
        // Cloudinary URLs format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
        const urlParts = note.fileUrl.split("/");
        const uploadIndex = urlParts.findIndex((part) => part === "upload");
        if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
          // Get everything after "upload/v{version}/"
          const afterUpload = urlParts.slice(uploadIndex + 2).join("/");
          // Remove file extension
          const publicId = afterUpload.replace(/\.[^/.]+$/, "");

          // Delete from Cloudinary
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "auto",
          });
        }
      } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    await NoteModel.findByIdAndDelete(noteId);

    // Revalidate paths
    revalidatePath(`/classroom/${classroomId}/subject`);
    revalidatePath(`/classroom/${classroomId}`);

    return {
      data: { message: "Note deleted successfully" },
      error: null,
    };
  } catch (error) {
    console.error("Error deleting note:", error);
    return {
      data: null,
      error: error.message || "Failed to delete note",
    };
  }
}

