import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getDashboardMetrics } from '@/fetchers/get-dashboard-metrics';
import { DashboardClient } from './dashboard-client';

export const metadata = {
  title: 'Dashboard | EduZen',
  description: 'Track your test performance and academic progress',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'student') {
    redirect('/login');
  }

  const { data: dashboardData, error } = await getDashboardMetrics();

  return <DashboardClient dashboardData={dashboardData} error={error} />;
}
