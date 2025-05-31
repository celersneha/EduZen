import mongoose, { Schema } from "mongoose";

const testSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
  },
  chapterName: {
    type: String,
    trim: true,
    required: true,
  },
  topicName: {
    type: String,
    trim: true,
  },
  testScore: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  difficultyLevel: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  syllabus: {
    type: Schema.Types.ObjectId,
    ref: "Syllabus",
    required: true,
  },
});

const Test = mongoose.models.Test || mongoose.model("Test", testSchema);

export default Test;
