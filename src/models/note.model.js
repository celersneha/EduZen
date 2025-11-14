import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    chapter: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      // Optional: if notes are uploaded as PDF/file
    },
    fileType: {
      type: String,
      enum: ["text", "pdf", "doc"],
      default: "text",
    },
  },
  {
    timestamps: true,
  }
);

// Index to ensure one note per topic (unique constraint)
noteSchema.index({ classroom: 1, chapter: 1, topic: 1 }, { unique: true });

const NoteModel =
  mongoose.models.Note || mongoose.model("Note", noteSchema);

export default NoteModel;

