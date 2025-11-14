import dbConnect from '@/lib/dbConnect';
import NotificationModel from '@/models/notification.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

/**
 * Fetcher to get notifications for the current user
 * @returns {Promise<{data: array | null, error: string | null}>}
 */
export async function getNotifications() {
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

