'use server';

import dbConnect from '@/lib/db';
import NotificationModel from '@/models/notification.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { revalidatePath } from 'next/cache';

/**
 * Server action to get notifications for the current user
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function getNotificationsAction() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user = session?.user;
    if (!user) {
      return {
        data: null,
        error: 'Unauthorized',
      };
    }

    // Get all notifications for the user, sorted by newest first
    const notifications = await NotificationModel.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Transform notifications for client
    const formattedNotifications = notifications.map((notif) => ({
      id: notif._id.toString(),
      type: notif.type,
      title: notif.title,
      message: notif.message,
      isRead: notif.isRead,
      actionUrl: notif.actionUrl,
      metadata: notif.metadata,
      createdAt: notif.createdAt,
    }));

    // Count unread notifications
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return {
      data: {
        notifications: formattedNotifications,
        unreadCount,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return {
      data: null,
      error: 'Failed to fetch notifications',
    };
  }
}

/**
 * Server action to mark a notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function markNotificationRead(notificationId) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user = session?.user;
    if (!user) {
      return {
        data: null,
        error: 'Unauthorized',
      };
    }

    if (!notificationId) {
      return {
        data: null,
        error: 'Notification ID is required',
      };
    }

    // Update notification and verify it belongs to the user
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: notificationId, userId: user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return {
        data: null,
        error: 'Notification not found or unauthorized',
      };
    }

    // Revalidate paths that might show notifications
    revalidatePath('/student/dashboard');
    revalidatePath('/student/dashboard');

    return {
      data: { success: true },
      error: null,
    };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return {
      data: null,
      error: 'Failed to mark notification as read',
    };
  }
}

/**
 * Server action to mark all notifications as read
 * @returns {Promise<{data: object | null, error: string | null}>}
 */
export async function markAllNotificationsRead() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const user = session?.user;
    if (!user) {
      return {
        data: null,
        error: 'Unauthorized',
      };
    }

    // Mark all unread notifications as read for the user
    await NotificationModel.updateMany(
      { userId: user.id, isRead: false },
      { isRead: true }
    );

    // Revalidate paths that might show notifications
    revalidatePath('/student/dashboard');
    revalidatePath('/student/dashboard');

    return {
      data: { success: true },
      error: null,
    };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return {
      data: null,
      error: 'Failed to mark all notifications as read',
    };
  }
}

