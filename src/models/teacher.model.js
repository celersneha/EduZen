import mongoose, { Schema } from "mongoose";

const teacherSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    classrooms: [
      {
        type: Schema.Types.ObjectId,
        ref: "Classroom",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TeacherModel =
  mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);

export default TeacherModel;

