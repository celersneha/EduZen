import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import StudentModel from "@/models/student.model";
import SubjectModel from "@/models/subject.model";

export async function GET(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user = session?.user;
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const studentId = user.id;

    console.log("Fetching subjects for student:", studentId);
    

    // Get the full user document with populated subjects
    const studentWithSubjects = await StudentModel.findById(studentId).populate(
      "subjects"
    );

    console.log("Student with subjects:", studentWithSubjects);

    if (!studentWithSubjects) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const subjects = studentWithSubjects.subjects;

    if (!subjects || subjects.length === 0) {
      return NextResponse.json(
        { success: false, message: "No subjects found for this student" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      subjects: subjects,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
