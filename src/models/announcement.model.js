import mongoose, { Schema } from 'mongoose';

const announcementSchema = new Schema(
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
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
announcementSchema.index({ classroom: 1, createdAt: -1 });

const AnnouncementModel =
  mongoose.models.Announcement ||
  mongoose.model('Announcement', announcementSchema);

export default AnnouncementModel;

