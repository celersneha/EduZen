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

const syllabusSchema = new mongoose.Schema({
  syllabusSubject: {
    type: String,
    required: true,
  },
  syllabusDescription: {
    type: String,
  },
  syllabusInstitute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  chapters: [chapterSchema],
});

const Syllabus =
  mongoose.models.Syllabus || mongoose.model("Syllabus", syllabusSchema);

export default Syllabus;
