'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getNotificationsAction,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/actions/mark-notification-read';
import Link from 'next/link';

// Helper function to format date as "X time ago"
const formatTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else {
    return past.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: past.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};

/**
 * Notification Bell Component
 * Displays a bell icon with unread notification count and dropdown
 */
export function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await getNotificationsAction();
      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }
      if (data) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch notifications on mount and when dropdown opens
  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Handle marking a single notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      const { error } = await markNotificationRead(notificationId);
      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await markAllNotificationsRead();
      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }
    // Navigate if actionUrl exists
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setIsOpen(false);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'classroom_invitation':
        return '🎓';
      case 'announcement':
        return '📢';
      case 'test_result':
        return '📝';
      default:
        return '🔔';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 max-h-[500px] overflow-y-auto"
        align="end"
      >
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="py-1">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative flex gap-3 p-3 cursor-pointer hover:bg-accent transition-colors ${
                  !notification.isRead ? 'bg-blue-50/50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                {/* Unread indicator */}
                {!notification.isRead && (
                  <div className="absolute left-2 top-4 h-2 w-2 bg-blue-600 rounded-full"></div>
                )}

                {/* Notification icon */}
                <div className="flex-shrink-0 mt-0.5 text-lg">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Notification content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        aria-label="Mark as read"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Link
                href="/notifications"
                className="block text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

