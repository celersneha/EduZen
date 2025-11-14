import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getNotifications } from '@/fetchers/notification/get-notifications';
import { NotificationsClient } from './client';

export const metadata = {
  title: 'Notifications | EduZen',
  description: 'View all your notifications',
};

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'student') {
    redirect('/login');
  }

  const { data, error } = await getNotifications();

  return (
    <NotificationsClient
      notifications={data?.notifications || []}
      unreadCount={data?.unreadCount || 0}
      error={error}
    />
  );
}

