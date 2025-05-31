import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StudentModel from "@/models/student.model";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    await dbConnect();

    const user = await StudentModel.findOne({ email: email });

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
