'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bell, Check, CheckCheck, BookOpen, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  markNotificationRead,
  markAllNotificationsRead,
} from '@/actions/notification/mark-notification-read';

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

// Get notification icon based on type
const getNotificationIcon = (type) => {
  switch (type) {
    case 'classroom_invite':
      return <Users className="h-4 w-4 text-blue-600" />;
    case 'announcement':
      return <MessageSquare className="h-4 w-4 text-purple-600" />;
    case 'test_result':
      return <BookOpen className="h-4 w-4 text-green-600" />;
    default:
      return <Bell className="h-4 w-4 text-gray-600" />;
  }
};

export function NotificationsClient({ notifications, unreadCount, error }) {
  const router = useRouter();
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  // Handle marking a single notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      const { error } = await markNotificationRead(notificationId);
      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }
      // Remove notification from list when marked as read (for cleaner UI)
      setLocalNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
      setLocalUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      setIsMarkingAll(true);
      const { error } = await markAllNotificationsRead();
      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }
      // Clear all notifications from the list when all are marked as read
      setLocalNotifications([]);
      setLocalUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/student/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                  {localUnreadCount > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-600 text-white rounded-full">
                      {localUnreadCount} unread
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Stay updated with all your important notifications
                </CardDescription>
              </div>
              {localUnreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingAll}
                >
                  {isMarkingAll ? (
                    <>
                      <Check className="mr-2 h-4 w-4 animate-spin" />
                      Marking...
                    </>
                  ) : (
                    <>
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Mark all as read
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {localNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 font-medium">No notifications yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  You&apos;ll see notifications here when you receive them
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {localNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                      !notification.isRead ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-gray-200'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
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
                            <p className="text-xs text-muted-foreground mt-1">
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

