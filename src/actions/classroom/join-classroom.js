"use server";

import dbConnect from "@/lib/db";
import ClassroomModel from "@/models/classroom.model";
import StudentModel from "@/models/student.model";
import NotificationModel from "@/models/notification.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";

/**
 * Server action for a student to join a classroom
 * @param {string} classroomCode - Unique code for the classroom
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function joinClassroom(classroomCode) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user = session?.user;
    if (!user || user.role !== "student") {
      return {
        data: null,
        error: "Unauthorized. Student access required.",
      };
    }

    if (!classroomCode) {
      return {
        data: null,
        error: "Classroom code is required",
      };
    }

    // Find student record
    const student = await StudentModel.findOne({ userId: user.id });
    if (!student) {
      return {
        data: null,
        error: "Student record not found",
      };
    }

    // Find classroom by code
    const classroom = await ClassroomModel.findOne({ classroomCode });
    if (!classroom) {
      return {
        data: null,
        error: "Classroom not found",
      };
    }

    // Check if student is already in the classroom
    if (classroom.students.includes(student._id)) {
      return {
        data: null,
        error: "You are already a member of this classroom",
      };
    }

    // Add student to classroom
    await ClassroomModel.findByIdAndUpdate(
      classroom._id,
      { $push: { students: student._id } },
      { new: true }
    );

    // Add classroom to student's classrooms array
    await StudentModel.findByIdAndUpdate(
      student._id,
      { $push: { classrooms: classroom._id } },
      { new: true }
    );

    // Mark any related classroom invitation notifications as read
    await NotificationModel.updateMany(
      {
        userId: user.id,
        type: 'classroom_invitation',
        classroomId: classroom._id,
        isRead: false,
      },
      { isRead: true }
    );

    // Revalidate student classrooms list
    revalidatePath("/student/student-classroom/list");

    return {
      data: {
        message: "Successfully joined classroom",
        classroom: {
          id: classroom._id.toString(),
          classroomName: classroom.classroomName,
          classroomCode: classroom.classroomCode,
        },
      },
      error: null,
    };
  } catch (error) {
    console.error("Error joining classroom:", error);
    return {
      data: null,
      error: "Failed to join classroom",
    };
  }
}
