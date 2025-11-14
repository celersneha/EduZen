import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['classroom_invitation', 'announcement', 'test_result', 'system'],
      default: 'system',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    // Metadata for different notification types
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    // For classroom invitations
    classroomId: {
      type: Schema.Types.ObjectId,
      ref: 'Classroom',
    },
    classroomCode: {
      type: String,
    },
    // Action link/route
    actionUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model('Notification', notificationSchema);

export default NotificationModel;

