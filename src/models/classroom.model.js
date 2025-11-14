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
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
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
    strictPopulate: false,
  }
);

// Delete the model if it exists to force recompilation with new schema
if (mongoose.models.Classroom) {
  delete mongoose.models.Classroom;
}

const ClassroomModel = mongoose.model("Classroom", classroomSchema);

export default ClassroomModel;
