import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SubjectModel from "@/models/subject.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    // Authentication check
    const user = session?.user;
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    // The studentId is retrieved but not used in the current implementation
    const studentId = user._id;

    // Get subjectID from query parameters
    const subjectId = req.nextUrl.searchParams.get("subjectID");
    if (!subjectId) {
      return NextResponse.json(
        { success: false, message: "Subject ID is required" },
        { status: 400 }
      );
    }

    // Fetch the subject document which should contain syllabus data
    const subject = await SubjectModel.findById(subjectId);

    if (!subject) {
      return NextResponse.json(
        { success: false, message: "Subject not found" },
        { status: 404 }
      );
    }

    // Return the complete subject object (including syllabus)
    return NextResponse.json(subject);
  } catch (error) {
    console.error("Error fetching syllabuses:", error);
    return NextResponse.json(
      { error: "Failed to fetch syllabuses" },
      { status: 500 }
    );
  }
}
