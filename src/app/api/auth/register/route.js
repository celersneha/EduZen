import sendVerificationEmail from "@/utils/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import UserModel from "@/models/user.model";
import StudentModel from "@/models/student.model";
import TeacherModel from "@/models/teacher.model";

export async function POST(req) {
  await dbConnect();

  try {
    const { name, email, username, password, role = "student" } = await req.json();

    // Validate role
    if (!["student", "teacher"].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role. Must be 'student' or 'teacher'.",
        },
        { status: 400 }
      );
    }

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists.",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    // Random 6-digit verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    let user;

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already exists",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        existingUserByEmail.role = role;
        await existingUserByEmail.save();
        user = existingUserByEmail;
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      user = new UserModel({
        name,
        email,
        username,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        role,
      });

      await user.save();
    }

    // Create Student or Teacher record after user is verified (will be done in verify route)
    // For now, we'll create it here but it will be properly linked after verification

    // ✅ Send OTP Email
    const emailResponse = await sendVerificationEmail(email, verifyCode);

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
