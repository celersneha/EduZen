import mongoose, { Schema } from 'mongoose';

const videoLectureSchema = new Schema(
  {
    classroom: {
      type: Schema.Types.ObjectId,
      ref: 'Classroom',
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // Duration in seconds
      default: 0,
    },
    fileSize: {
      type: Number, // File size in bytes
      default: 0,
    },
    chapter: {
      type: String,
      trim: true,
    },
    topic: {
      type: String,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
videoLectureSchema.index({ classroom: 1, createdAt: -1 });
videoLectureSchema.index({ teacher: 1 });

const VideoLectureModel =
  mongoose.models.VideoLecture ||
  mongoose.model('VideoLecture', videoLectureSchema);

export default VideoLectureModel;

