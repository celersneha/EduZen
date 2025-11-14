import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel from "@/models/user.model";
import StudentModel from "@/models/student.model";
import TeacherModel from "@/models/teacher.model";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    await dbConnect();

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "User already verified" },
        { status: 400 }
      );
    }

    if (user.verifyCode !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (user.verifyCodeExpiry < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // Update user verification status
    user.isVerified = true;
    await user.save();

    // Create Student or Teacher record based on role
    if (user.role === "student") {
      // Check if student record already exists
      const existingStudent = await StudentModel.findOne({ userId: user._id });
      if (!existingStudent) {
        await StudentModel.create({
          userId: user._id,
          subjects: [],
          classrooms: [],
        });
      }
    } else if (user.role === "teacher") {
      // Check if teacher record already exists
      const existingTeacher = await TeacherModel.findOne({ userId: user._id });
      if (!existingTeacher) {
        await TeacherModel.create({
          userId: user._id,
          classrooms: [],
        });
      }
    }

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Error verifying email" },
      { status: 500 }
    );
  }
}
