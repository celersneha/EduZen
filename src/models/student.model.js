import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    classrooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const StudentModel =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default StudentModel;
