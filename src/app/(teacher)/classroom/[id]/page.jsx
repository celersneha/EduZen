import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getClassrooms } from "@/fetchers/get-classrooms";
import { getAnnouncements } from "@/fetchers/get-announcements";
import { getVideoLectures } from "@/fetchers/get-video-lectures";
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
    return <div>Error: {error}</div>;
  }

  const classroom = classrooms?.find((c) => c.id === resolvedParams.id);

  if (!classroom) {
    redirect("/teacher/dashboard");
  }

  const { data: announcements, error: announcementsError } =
    await getAnnouncements(resolvedParams.id);

  const { data: videoLectures, error: videoLecturesError } =
    await getVideoLectures(resolvedParams.id);

  return (
    <ClassroomDetailClient
      classroom={classroom}
      announcements={announcements || []}
      videoLectures={videoLectures || []}
    />
  );
}
