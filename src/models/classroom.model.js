import mongoose, { Schema } from "mongoose";

const classroomSchema = new Schema(
  {
    classroomName: {
      type: String,
      required: true,
      trim: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    syllabusId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      default: null,
    },
    classroomCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ClassroomModel =
  mongoose.models.Classroom || mongoose.model("Classroom", classroomSchema);

export default ClassroomModel;

