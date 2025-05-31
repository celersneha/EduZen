import mongoose from "mongoose";
import Student from "./student.model";

const chapterSchema = new mongoose.Schema({
  chapterName: {
    type: String,
  },
  topics: {
    type: [String],
  },
});

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
    },
    subjectDescription: {
      type: String,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    chapters: [chapterSchema],
  },
  {
    timestamps: true,
  }
);

const SubjectModel =
  mongoose.models.Subject || mongoose.model("Subject", subjectSchema);

export default SubjectModel;
