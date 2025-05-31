import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import TestModel from "@/models/test.model";

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      studentId,
      subjectId,
      chapterName,
      topicName,
      testScore,
      difficultyLevel
    } = await req.json();

    // Validate required fields
    if (!studentId || !subjectId || !chapterName || !difficultyLevel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new test record
    const testResult = new TestModel({
      studentId,
      subject: subjectId,
      chapterName,
      topicName,
      testScore,
      difficultyLevel
    });

    await testResult.save();

    return NextResponse.json({
      success: true,
      message: "Test result saved successfully",
      testId: testResult._id
    });

  } catch (error) {
    console.error("Error saving test result:", error);
    return NextResponse.json(
      { error: "Failed to save test result" },
      { status: 500 }
    );
  }
}
