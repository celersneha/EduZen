import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getClassrooms } from "@/fetchers/get-classrooms";
import { getAnnouncements } from "@/fetchers/get-announcements";
import { ClassroomDetailClient } from "./classroom-detail-client";

export const metadata = {
  title: "Classroom Management | EduZen",
  description: "Manage your classroom, upload syllabus, and invite students",
};

export default async function ClassroomDetailPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "teacher") {
    redirect("/dashboard");
  }

  const resolvedParams = await params;

  const { data: classrooms, error } = await getClassrooms();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Classroom
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const classroom = classrooms?.find((c) => c.id === resolvedParams.id);

  if (!classroom) {
    redirect("/teacher/dashboard");
  }

  const { data: announcements, error: announcementsError } =
    await getAnnouncements(resolvedParams.id);

  // Log errors but don't block the page - show empty arrays instead
  if (announcementsError) {
    console.error("Error fetching announcements:", announcementsError);
  }

  return (
    <ClassroomDetailClient
      classroom={classroom}
      announcements={announcements || []}
      announcementsError={announcementsError}
    />
  );
}
